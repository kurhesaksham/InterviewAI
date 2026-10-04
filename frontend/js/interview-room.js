let config = JSON.parse(
    localStorage.getItem("interviewConfig")
);


if (!config) {
    window.location.href = "interview.html";
}


let currentQuestion = 1;

let totalQuestions = config.questions;

let seconds = 0;

let timerInterval;

let currentQuestionText = "";

let interviewResults = [];
let askedQuestions = [];


/* --------------------------------------------------
   LOAD CONFIGURATION
-------------------------------------------------- */

document.getElementById("roleDisplay").textContent =
    formatRole(config.role);

document.getElementById("totalQuestions").textContent =
    totalQuestions;

document.getElementById("difficultyDisplay").textContent =
    capitalize(config.difficulty);


/* --------------------------------------------------
   LOAD FIRST AI QUESTION
-------------------------------------------------- */

loadAIQuestion();


async function loadAIQuestion() {

    const questionText =
        document.getElementById("questionText");

    questionText.textContent =
        "AI is preparing your question...";


    try {

        const response = await fetch(
            "/api/start-interview",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                     ...config,
                     previousQuestions: askedQuestions
                    })
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "Failed to generate question."
            );

        }
        
        currentQuestionText =
        data.question;
        
        askedQuestions.push(
            currentQuestionText
        );
        
        questionText.textContent =
        currentQuestionText;


    } catch (error) {

        console.error(error);

        questionText.textContent =
            "Unable to generate the interview question.";

        alert(
            "Could not connect to the AI backend. Make sure Flask is running."
        );

    }
}


/* --------------------------------------------------
   WORD COUNT
-------------------------------------------------- */

document
    .getElementById("answer")
    .addEventListener(
        "input",
        updateWordCount
    );


function updateWordCount() {

    const text =
        document
            .getElementById("answer")
            .value
            .trim();


    const words =
        text === ""
            ? 0
            : text.split(/\s+/).length;


    document.getElementById("wordCount")
        .textContent =
            words +
            (words === 1 ? " word" : " words");
}


/* --------------------------------------------------
   SUBMIT ANSWER
-------------------------------------------------- */

async function submitAnswer() {

    const answer =
        document
            .getElementById("answer")
            .value
            .trim();


    if (!answer) {

        alert(
            "Please enter your answer first."
        );

        return;
    }


    const submitButton =
        document.getElementById("submitBtn");


    submitButton.disabled = true;


    document.getElementById("thinking")
        .style.display = "flex";


    try {

        const response = await fetch(
            "/api/evaluate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    question:
                        currentQuestionText,

                    answer:
                        answer,

                    role:
                        config.role,

                    interviewType:
                        config.interviewType,

                    difficulty:
                        config.difficulty

                })
            }
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Evaluation failed."
            );

        }


        const evaluation =
            data.evaluation;


        interviewResults.push({

            question:
                currentQuestionText,

            answer:
                answer,

            evaluation:
                evaluation

        });


        showFeedback(evaluation);


    } catch (error) {

        console.error(error);

        alert(
            "AI evaluation failed. Check your Flask server and API key."
        );

        submitButton.disabled = false;

    }


    document.getElementById("thinking")
        .style.display = "none";
}


/* --------------------------------------------------
   SHOW AI FEEDBACK
-------------------------------------------------- */

function showFeedback(evaluation) {

    document.getElementById("score")
        .textContent =
            evaluation.overall_score + "/10";


    document.getElementById("feedbackText")
        .textContent =
            evaluation.feedback;


    document.getElementById("feedback")
        .style.display =
            "block";


    document.getElementById("submitBtn")
        .style.display =
            "none";
}


/* --------------------------------------------------
   NEXT QUESTION
-------------------------------------------------- */

async function nextQuestion() {

    if (currentQuestion >= totalQuestions) {

        localStorage.setItem(
            "interviewResults",
            JSON.stringify(
                interviewResults
            )
        );


        window.location.href =
            "results.html";


        return;
    }


    currentQuestion++;


    document.getElementById("currentQuestion")
        .textContent =
            currentQuestion;


    const progress =
        (currentQuestion / totalQuestions) * 100;


    document.getElementById("progressFill")
        .style.width =
            progress + "%";


    document.getElementById("feedback")
        .style.display =
            "none";


    document.getElementById("submitBtn")
        .style.display =
            "inline-block";


    document.getElementById("submitBtn")
        .disabled =
            false;


    document.getElementById("answer")
        .value = "";


    updateWordCount();


    await loadAIQuestion();
}


/* --------------------------------------------------
   VOICE INPUT
-------------------------------------------------- */

function toggleVoice() {

    if (
        !("webkitSpeechRecognition" in window)
    ) {

        alert(
            "Speech recognition is not supported in this browser."
        );

        return;
    }


    const recognition =
        new webkitSpeechRecognition();


    recognition.lang =
        "en-US";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.onstart =
        function () {

            document.querySelector(
                "#voiceBtn span"
            ).textContent =
                "Listening...";

        };


    recognition.onresult =
        function (event) {

            const transcript =
                event
                    .results[0][0]
                    .transcript;


            const textarea =
                document.getElementById(
                    "answer"
                );


            textarea.value +=
                (
                    textarea.value
                        ? " "
                        : ""
                ) + transcript;


            updateWordCount();

        };


    recognition.onend =
        function () {

            document.querySelector(
                "#voiceBtn span"
            ).textContent =
                "Use microphone";

        };


    recognition.start();
}


/* --------------------------------------------------
   TIMER
-------------------------------------------------- */

timerInterval =
    setInterval(
        () => {

            seconds++;


            const minutes =
                Math.floor(
                    seconds / 60
                );


            const remainingSeconds =
                seconds % 60;


            document.getElementById(
                "timer"
            ).textContent =

                String(minutes)
                    .padStart(2, "0")

                + ":"

                +

                String(
                    remainingSeconds
                ).padStart(2, "0");

        },

        1000
    );


/* --------------------------------------------------
   EXIT
-------------------------------------------------- */

function confirmExit() {

    document.getElementById(
        "exitModal"
    ).style.display =
        "flex";
}


function closeExitModal() {

    document.getElementById(
        "exitModal"
    ).style.display =
        "none";
}


function leaveInterview() {

    clearInterval(
        timerInterval
    );


    localStorage.removeItem(
        "interviewConfig"
    );


    window.location.href =
        "index.html";
}


/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function capitalize(value) {

    return value
        .charAt(0)
        .toUpperCase()
        +
        value.slice(1);
}


function formatRole(role) {

    return role

        .split("-")

        .map(
            word =>
                word.charAt(0).toUpperCase()
                +
                word.slice(1)
        )

        .join(" ");
}