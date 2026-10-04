const form = document.getElementById("interviewForm");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const role = document.getElementById("role").value;

    const experience =
        document.querySelector(
            'input[name="experience"]:checked'
        ).value;

    const interviewType =
        document.querySelector(
            'input[name="type"]:checked'
        ).value;

    const difficulty =
        document.querySelector(
            'input[name="difficulty"]:checked'
        ).value;

    const questions =
        document.getElementById("questions").value;


    const interviewConfig = {

        role: role,

        experience: experience,

        interviewType: interviewType,

        difficulty: difficulty,

        questions: Number(questions)

    };


    localStorage.setItem(
        "interviewConfig",
        JSON.stringify(interviewConfig)
    );


    console.log(
        "Interview configuration:",
        interviewConfig
    );


    // Temporary navigation.
    // We will create this page next.

    window.location.href = "interview-room.html";

});