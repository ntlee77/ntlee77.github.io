//Creation Date: 7/10/2015

var currentQuestion = 1;
var question5to3 = false;

/* If the page is reloaded, makes sure the radio buttons are blank even if they had been selected before the reload. */
window.onload = function(){
    theForm1.reset();
    theForm3.reset();
    theForm4.reset();
    theForm5.reset();
    theForm6.reset();
    theForm7.reset();
}

/* Displays the screen for the first question. Triggered when start button is clicked. */
function startQuiz() {
    document.getElementById("charge_brief").className = "invisible";
    document.getElementById("question-1").className = "question";
    var startBtn = document.getElementById('startQuizBtn');
    startBtn.parentNode.removeChild(startBtn);
    var x = document.getElementById("introbox1");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    
    var prevBtn = document.getElementById("prevBtn");
    prevBtn.style.opacity = 0.4;
    prevBtn.style.pointerEvents = "none";
}

/* Dynamically gets the amount of questions that have been created on the HTML page. For current version, this function will always return 7. */
function getNumberOfQuestions() {
    //QuerySelectorAll has better browser support in exchange for being slightly slower than gEBCN. 
    return document.querySelectorAll('#quiz-questions .question').length;
}

/* Advances to the next question. */
function nextQuestion() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (currentQuestion == 1) {
        var prevBtn = document.getElementById("prevBtn");
        prevBtn.style.opacity = 1;
        prevBtn.style.pointerEvents = "auto";
    }
    
    hideQuestion(currentQuestion);
    if (!(currentQuestion == 1 && document.getElementById("gc_yes").checked)) hideAnswerButton();
    if (currentQuestion == 1 && document.getElementById("gc_no").checked) {
        currentQuestion = 5;
    } else if ((currentQuestion == 5 && document.getElementById("citizenship").checked)
               || (currentQuestion == 5 && document.getElementById("gcbasedonutvisavawaorasylum").checked)) {
        currentQuestion = 3; 
        question5to3 = true;
    } else if ((currentQuestion == 3 && document.getElementById("famgcapp_no").checked) 
              || (currentQuestion == 4)
              || (currentQuestion == 5 && !document.getElementById("noneoftheabove").checked
                                       && !document.getElementById("citizenship").checked 
                                       && !document.getElementById("gcbasedonutvisavawaorasylum").checked)
              || (currentQuestion == 6 && document.getElementById("none_famgcapp_no").checked)) {
        currentQuestion = 8;
    } else {
        currentQuestion++;
    }
    showQuestion(currentQuestion);
}

/* Goes back to the previous question. */
function previousQuestion() {
    if (currentQuestion != 2) { //since question-2 does not have a form
        var formName = "theForm" + currentQuestion;
        document.getElementById(formName).reset();
    }
    
    if (currentQuestion == 2 || currentQuestion == 5) {
        var prevBtn = document.getElementById("prevBtn");
        prevBtn.style.opacity = 0.4;
        prevBtn.style.pointerEvents = "none";
    }
    
    if (currentQuestion == 5) {
        hideQuestion(currentQuestion);
        currentQuestion = 1;
        showQuestion(1);
    } else if (currentQuestion == 3 && question5to3) {
        hideQuestion(currentQuestion);
        currentQuestion = 5;
        showQuestion(5);
    } else {
        hideQuestion(currentQuestion);
        currentQuestion--;    
        showQuestion(currentQuestion);
    }
}

/* Shows buttons "previous question" and "next question" buttons. */
function showAnswerButton() {
    //yes, that's correct. this is my lazy way of input validation without annoying users
    //(e.g. transition on-click events) on the radio buttons...
    document.getElementById("confirm_answer").className = "";
}

/* Hides buttons "previous question" and "next question". */
function hideAnswerButton() {
    document.getElementById("confirm_answer").className = "invisible";
}

/* Hides the question passed as an input parameter. */
function hideQuestion(id) {
    document.getElementById("question-" + id).className = "question invisible";
}

/* Shows the question passed as an input parameter. */
function showQuestion(id) {
    var totalQuestions = getNumberOfQuestions();
    if (id <= totalQuestions) {
        document.getElementById("question-" + id).className = "question";
    } else {
        setEndingSentence() //begins the end screen process if id is above total question
    }
}

/* Triggered once there are no more relevant questions to be asked. Computes and outputs results. */
function setEndingSentence() {
    var chargeResults = getEndingSentence(); //see below
    document.getElementById("results_screen").className = "";
    document.getElementById("generated_text").innerHTML = chargeResults; 
    var e = document.getElementById("info_screen");
    e.style.display = "block";
} 

/* Based on previous quiz answers, determines which information is relevant and should be shown on the results page. */
function getEndingSentence() {
    var quizRadioRQ = document.getElementsByName("rq");
    var quizRadio = [];
    var content;
    for (var i = 0; i < quizRadioRQ.length; i++) {
        if (quizRadioRQ[i].checked) {
            quizRadio.push(quizRadioRQ[i].id);
        }
    }
   /* var txtDNA = "does not apply";
    var txtMA = "may apply"; */
    
    if (quizRadio[0] == "gc_yes") {
        if (quizRadio[1] == "famgcapp_yes") {
            if (quizRadio[2] == "faminterviewUS") content = "You and other family members (not the one you are sponsoring) can use any benefits without affecting the one you are sponsoring.";
            else /* quizRadio[2] == "faminterviewconsulate" */ content = "Public charge might be an issue. Get immigration advice.";    
        } else /* quizRadio[1] == "famgcapp_no" */ content = "Again, public charge does not apply to you unless you leave the U.S. for more than 6 months.  Public charge does not affect applications for citizenship. Talk to an immigration attorney if you plan to leave for 6 months or more.";
    } else { //quizRadio[0] == "gc_no"
        if (quizRadio[1] == "famgcapp_no") {
            if (quizRadio[2] == "citizenship") {
                content = "Public charge "  /* +txtDNA.bold()*/+ " to you unless you leave the U.S. for more than 6 months. Public charge does not affect applications for citizenship. Talk to an immigration attorney if you plan to leave for 6 months or more."; 
            } else /* quizRadio[2] == "gcbasedonutvisavawaorasylum" */ {
                content = "Public charge does not apply to you unless you leave the U.S. for more than 6 months. Public charge does not apply for Green Card applications based on U/T visa, VAWA, or Asylum or to people who have Green Cards when they adjust status under this category. Talk to an immigration attorney if you plan to leave for 6 months or more.";
            }
        } else if (quizRadio[1] == "famgcapp_yes") {
            if (quizRadio[3] == "citizenship") {
                if (quizRadio[2] == "faminterviewUS") content = "Public charge doesn't apply to you since you are applying for citizenship. You may use any benefits for which you qualify. You and other family members (not the one you are sponsoring) can use any benefits without affecting the one you are sponsoring.";
                else /* quizRadio[2] == "faminterviewconsulate" */ content = "Public charge doesn't apply to you since you are applying for citizenship. You may use any benefits for which you qualify. However, public charge might be an issue for immigration. Get immigration advice.";
            } else { /* quizRadio[3] == "gcbasedonutvisavawaorasylum" */
                if (quizRadio[2] == "faminterviewUS") content = "Public charge doesn’t apply for Green Card applications based on U/T visa, VAWA, or Asylum or to people who have Green Cards when they adjust status under this category. You may use any benefits for which you qualify. You and other family members (not the one you are sponsoring) can use any benefits without affecting the one you are sponsoring.";
                else /* quizRadio[2] == "faminterviewconsulate" */ content = "Public charge doesn’t apply for Green Card applications based on U/T visa, VAWA, or Asylum or to people who have Green Cards when they adjust status under this category. You may use any benefits for which you qualify. However, public charge might be an issue for immigration. Get immigration advice.";
                }
        }
        else if (quizRadio[1] == "dacarenewal") content = "Public charge doesn’t apply for DACA renewal applications. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "uortvisa") content = "Public charge doesn’t apply for U or T Visa applications or to people who have U or T visas when they adjust status under this category. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "asylumorrefugeestatus") content = "Public charge doesn’t apply for Asylum or Refugee applications or to people who have Asylum or Refugee status when they adjust status under this category. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "tps") content = "Public charge doesn’t apply for TPS applications or to people who have TPS status when they adjust status under this category. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "vawa") content = "Public charge doesn’t apply for VAWA applications or to people who have VAWA status when they adjust status under this category. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "specialimmigrantjuvenilestatus") content = "Public charge doesn’t apply for Special Immigrant Juvenile Status applications or to people who have Special Immigrant Juvenile status when they adjust status under this category. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "specialimmigrantvisastatus") content = "Public charge doesn’t apply for Special Immigrant Visa applications or to people who have a Special Immigrant visa when they adjust status under this category. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "adjustmentundernarcara") content = "Public charge doesn’t apply for NACARA applications or to people who have NACARA status when they adjust status under this category. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "adjustmentunderhaifa") content = "Public charge doesn’t apply for HAIFA applications or to people who have HAIFA status when they adjust status under this category. You may use any benefits for which you qualify.";
        else if (quizRadio[1] == "adjustmentundercaa") content = "Public charge doesn’t apply for CAA applications or to people who have CAA status when they adjust status under this category. You may use any benefits for which you qualify.";
        else { //quizRadio[1] == "noneoftheabove"
            if (quizRadio[2] == "none_famgcapp_yes") {
                if (quizRadio[3] == "none_whereapply_insideus") content = "A public charge test may apply, but only a few benefits that an applicant receives would count. It is still safe to get Medi-Cal and CalFresh/food stamp benefits. Eligible family members can use any benefits for which they qualify. Use of certain benefits is only one factor. In this situation, immigration will also consider your health, age, education, skills, employment, current income and sponsor’s income when deciding if you will be a public charge.";
                else /* quizRadio[3] == "none_whereapply_outsideus" */ content = "A public charge test applies in this situation. Talk to a qualified attorney about this.";
            } else /* quizRadio[2] == "none_famgcapp_no" */ content = "Public charge does not apply right now. If you think you might seek to adjust through a family member in the distant future, consult a qualified immigration attorney.";
        }
    }
    return content;
}
