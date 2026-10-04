const results =
    JSON.parse(
        localStorage.getItem("interviewResults")
    ) || [];


if (results.length === 0) {

    document.getElementById("performanceTitle")
        .textContent =
        "No interview data found.";

} else {

    calculateResults();

}


/* --------------------------------------------------
   CALCULATE FINAL RESULTS
-------------------------------------------------- */

function calculateResults() {

    let accuracy = 0;

    let relevance = 0;

    let clarity = 0;

    let completeness = 0;

    let overall = 0;


    results.forEach(item => {

        const evaluation =
            item.evaluation;


        accuracy +=
            Number(
                evaluation.accuracy_score
            );


        relevance +=
            Number(
                evaluation.relevance_score
            );


        clarity +=
            Number(
                evaluation.clarity_score
            );


        completeness +=
            Number(
                evaluation.completeness_score
            );


        overall +=
            Number(
                evaluation.overall_score
            );

    });


    const count = results.length;


    accuracy =
        accuracy / count;


    relevance =
        relevance / count;


    clarity =
        clarity / count;


    completeness =
        completeness / count;


    overall =
        overall / count;


    displayScore(
        overall,
        accuracy,
        relevance,
        clarity,
        completeness
    );


    displayQuestionResults();

}


/* --------------------------------------------------
   DISPLAY SCORE
-------------------------------------------------- */

function displayScore(
    overall,
    accuracy,
    relevance,
    clarity,
    completeness
) {

    document.getElementById(
        "overallScore"
    ).textContent =
        overall.toFixed(1);


    document.getElementById(
        "accuracy"
    ).textContent =
        accuracy.toFixed(1) + "/10";


    document.getElementById(
        "relevance"
    ).textContent =
        relevance.toFixed(1) + "/10";


    document.getElementById(
        "clarity"
    ).textContent =
        clarity.toFixed(1) + "/10";


    document.getElementById(
        "completeness"
    ).textContent =
        completeness.toFixed(1) + "/10";


    setBar(
        "accuracyBar",
        accuracy
    );


    setBar(
        "relevanceBar",
        relevance
    );


    setBar(
        "clarityBar",
        clarity
    );


    setBar(
        "completenessBar",
        completeness
    );


    let title;

    let description;


    if (overall >= 8.5) {

        title = "Excellent Performance";

        description =
            "You demonstrated strong interview skills and a solid understanding of the topics.";

    }

    else if (overall >= 7) {

        title = "Good Performance";

        description =
            "You have a good foundation. A little more practice can make your answers stronger.";

    }

    else if (overall >= 5) {

        title = "Room for Improvement";

        description =
            "You understand some concepts, but more practice will help improve your interview performance.";

    }

    else {

        title = "Keep Practicing";

        description =
            "Use the feedback below to strengthen your fundamentals and try another interview.";

    }


    document.getElementById(
        "performanceTitle"
    ).textContent =
        title;


    document.getElementById(
        "performanceText"
    ).textContent =
        description;


    buildInsights();

}


/* --------------------------------------------------
   PROGRESS BAR
-------------------------------------------------- */

function setBar(
    id,
    score
) {

    document.getElementById(id)
        .style.width =
        (score * 10) + "%";

}


/* --------------------------------------------------
   INSIGHTS
-------------------------------------------------- */

function buildInsights() {

    const strengths = [];

    const improvements = [];


    results.forEach(item => {

        const evaluation =
            item.evaluation;


        if (
            evaluation.overall_score >= 8
        ) {

            if (
                evaluation.strengths
            ) {

                strengths.push(
                    ...evaluation.strengths
                );

            }

        }


        if (
            evaluation.overall_score < 7
        ) {

            if (
                evaluation.improvements
            ) {

                improvements.push(
                    ...evaluation.improvements
                );

            }

        }

    });


    const uniqueStrengths =
        [...new Set(strengths)]
            .slice(0, 4);


    const uniqueImprovements =
        [...new Set(improvements)]
            .slice(0, 4);


    const strengthsList =
        document.getElementById(
            "strengthsList"
        );


    const improvementsList =
        document.getElementById(
            "improvementsList"
        );


    strengthsList.innerHTML = "";


    improvementsList.innerHTML = "";


    if (uniqueStrengths.length === 0) {

        strengthsList.innerHTML =
            "<li>Consistent effort across the interview.</li>";

    } else {

        uniqueStrengths.forEach(
            item => {

                const li =
                    document.createElement("li");

                li.textContent = item;

                strengthsList.appendChild(li);

            }
        );

    }


    if (uniqueImprovements.length === 0) {

        improvementsList.innerHTML =
            "<li>Continue practicing to improve consistency.</li>";

    } else {

        uniqueImprovements.forEach(
            item => {

                const li =
                    document.createElement("li");

                li.textContent = item;

                improvementsList.appendChild(li);

            }
        );

    }

}


/* --------------------------------------------------
   QUESTION BREAKDOWN
-------------------------------------------------- */

function displayQuestionResults() {

    const container =
        document.getElementById(
            "questionResults"
        );


    container.innerHTML = "";


    results.forEach(
        (item, index) => {

            const evaluation =
                item.evaluation;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "question-result";


            card.innerHTML = `

                <div class="question-result-header">

                    <div>

                        <div class="question-number">
                            QUESTION ${index + 1}
                        </div>

                        <h3>
                            ${escapeHTML(item.question)}
                        </h3>

                    </div>

                    <div class="question-score">
                        ${evaluation.overall_score}/10
                    </div>

                </div>

                <div class="question-feedback">

                    ${escapeHTML(
                        evaluation.feedback
                    )}

                </div>

            `;


            container.appendChild(card);

        }
    );

}


/* --------------------------------------------------
   SECURITY
-------------------------------------------------- */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* --------------------------------------------------
   NEW INTERVIEW
-------------------------------------------------- */

function startAgain() {

    localStorage.removeItem(
        "interviewResults"
    );


    localStorage.removeItem(
        "interviewConfig"
    );


    window.location.href =
        "interview.html";

}