(function($) {

    $.fn.activityMCQ = function() { 

        var plugin = this;

            //Get data from config file
            plugin.config = $.extend();

            // Set quiz info via quizJSON variable
            var activityValues = (plugin.config.json ? plugin.config.json : typeof activityJSON != 'undefined' ? activityJSON : null);

            // Get questions
            var questions = activityValues.questions;

            // Count the number of questions
            var questionCount = questions.length;

            //set variables
            var timerCtrl;
            var seconds = 0;
            var totalTimeTaken;
            var currentQuestion = 0;
             var attempted = 1;
 
            //Arrays           
            var attemptedArray = [];
            var questionsArray = []; 
            var answersArray = []; 
            var responseArray = [];
            var feedbackArray = [];
            var answersCheckedArray = [];




            //get variables from config
            //timePenaltyNumber counts up the number of penalties, timePenaltyTime is set in config and is the amount of time per penalty
            var timePenaltyNumber = 0;
            var timePenaltyTime = activityValues.info.timePenaltyTime;
            
            //gets the medal categories from config
            var goldTime = activityValues.info.Gold;
            var silverTime = activityValues.info.Silver;
            var bronzeTime = activityValues.info.Bronze;
            
            //gets the number of questions and the number of answers for each question
            var numberofQuestions = activityValues.info.numberofQuestions;
            var attemptsAllowed = activityValues.info.attemptsAllowed;

            //gets instruction html
            var title = activityValues.info.title;
            var instructions = activityValues.info.instructions;

            //audio
            var incorrectAudio = $("audio")[0];
            var correctAudio = $("audio")[1];


            //set up start page by hiding question elements
            $("#questionArea").hide();
            $("#activityIntro").show();
            $("#nextButton").hide();
            $("#activityInfo").hide();
            $('#resultsArea').hide(); 
            $("#restartButton").hide();
            $("#currentQuestionDisplay").hide();
            $("#currentQuestionDisplay").hide();
            $("#checkAnswerButton").hide();



            // Activity instructions go here
            $("#title").html(title);
            $("#introductionText").html(instructions + secondsToHms(goldTime) + ".");


            //characters
            var charactersHTML = $('<div></div>');

            var characters = ["à", "â", "ä", "æ", "ç", "é", "è", "ê", "ë", "î", "ï", "ô", "œ", "ù", "û", "ü"];

            for (i in characters) {
                if (characters.hasOwnProperty(i)) {
                    character = characters[i],
                    characterId = character;
                    var charButton = '<input value="' + character +'" type="button" />';
                    charactersHTML.append(charButton);
                }
            };
            $("#charactersArea").append(charactersHTML);
            $("#charactersArea").hide();

            /**
            * @author joneshy
            */
            //shuffle function to shuffle questions or answers 
            function shuffle(o) {
                for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                    return o;
            };

            //convert seconds to hours minutes seconds
            function secondsToHms(d) {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
                return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "00:") + (s < 10 ? "0" : "") + s); 
            }

            //update the onscreen timer every second
            function timer() {
                seconds++;
                var currentTime = secondsToHms(seconds)
                $("#timeNumbers").html(currentTime);
            };



            function setActivity() {
                //clear any previous html from question
                $("#question").html(" ");

                //set up questions, answers and checking
                for (var i = 0; i < numberofQuestions; i++) {
                    answersArray[i] = questions[i].a;
                    questionsArray[i] = questions[i].q;
                    answersCheckedArray[i] = 0;
                };
                $.each(answersArray, function(index, value) {
					//ADDED [0] TO VALUE SO IT TARGETS FIRST OBJECT IN MD ARRAY
                    questionsArray[index] = questionsArray[index].replace(value[0], "<input id='inputTextBox" + index + "' type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='inputBox'>");
					//ADDED [0] TO VALUE SO IT TARGETS FIRST OBJECT IN MD ARRAY
                    console.log("answer = " + value[0]);
                });

                $.each(questionsArray, function(index, value) {
                    //sets question
                    $("#question").append("<h4 id='question" + index + "'>" + (index +1) + ". " + value + "</h4>");
                });               



            }
            

            //start the Activity
            function startActivity() {   

                $('body').removeClass().addClass('body-activity');                              

                //call setActivity to pick first 3 questions off the shuffled array of questions
                setActivity();  

                //show and hide page elements for the activity
                var currentQuestionNumber = currentQuestion + 1;
                attempted = 1;
                $("#currentQuestionDisplay").show();
                $("#currentQuestionDisplay").html("Attempt " + attempted + " out of " + attemptsAllowed);
                $("#activityArea").children().attr('disabled', false);
                //show elements
                $("#checkAnswerButton").show();
                $("#activityArea").show();
                $("#questionArea").show();
                $("#timeCounter").show();
                $("#currentQuestionDisplay").show();
                $("#charactersArea").show();
                $("#activityInfo").show();

                $("#inputTextBox0").focus();

                
                //hide elements
                $("#startButton").hide();
                $("#restartButton").hide();
                $("#activityIntro").hide();
                $("#introduction").hide();
                $('#resultsArea').hide(); 
                $("#nextButton").hide();
                $("#resultsFeedback").hide();

                timePenaltyNumber = 0;
                //start timer only on first press 
                $("#timeNumbers").html("00:00");
                timerCtrl = setInterval(timer, 1000);
                

            };  

            function checkAnswer() { 

                var numberOfCorrectAnswers = 0;

                var filled = $("#question :input").filter(function() {
                    return $.trim(this.value).length;
                });

                if(!filled.length) {
                    alert("Type your answers in the boxes");
                } 

                else {

                    $.each(answersArray, function(index, value) {
						
                        responseArray[index] = ($("#inputTextBox" + index)).val();
						//ADDED - FOR LOOP GOES THROUGH MD ARRAY
for (var i = 0; i < value.length; i++){
                        if ($.trim($('#inputTextBox' + index).val()) === "") {
                            console.log("#inputTextBox" + index + " is empty");

                            $("#inputTextBox" + index).removeClass("incorrectstyle correctstyle");
                            numberOfCorrectAnswers++;
                            feedbackArray[index] = "not attempted";
                            answersCheckedArray[index]++;   
                            timePenaltyNumber++;                     
							
                        }

						// ADDED [I] TO VALUE SO IT LOOPS THROUGH OBJECTS IN MD ARRAY
                        else if ($('#inputTextBox' + index).val() == value[i]) {
                            console.log("#inputTextBox" + index + " is marked correct");
                            $("#inputTextBox" + index).parent().removeClass("incorrectstyle").addClass("correctstyle");
                            feedbackArray[index] = "correct";
                            answersCheckedArray[index]++;                        
                            numberOfCorrectAnswers++;
							//ADDED - breaks out of loop
							return false;
                        }

                        else {
                            $("#inputTextBox" + index).removeClass("correctstyle").addClass("incorrectstyle");
                            console.log("#inputTextBox" + index + " is marked incorrect");
                            feedbackArray[index] = "incorrect";
                            answersCheckedArray[index]++;
                            timePenaltyNumber++;
                        }}
                    });
                }
                //correct and end of activity
            if (numberOfCorrectAnswers == numberofQuestions) {
                console.log("correct and end")
                results();
            }                

                //incorrect
                else {                    
                    console.log("incorrect")
                    incorrect();                    
                }
            }

           
            //if incorrect answer is pressed add time penalty
            function incorrect() {
                incorrectAudio.load();
                incorrectAudio.play();
                //increment attempts
                attempted++;
                $("#currentQuestionDisplay").html("Attempt " + attempted + " out of " + attemptsAllowed);
                if ((attempted - 1) >= attemptsAllowed) {
                    //load results
                    results();
                };

            }

            function correct() {
                correctAudio.load();
                correctAudio.play();
                
                //load results
                results();
            }



            //get medal categories            
            function getmedal(totalTimeTaken) {

                if (totalTimeTaken <= goldTime) {
                    medal = "Gold";

                } else if (totalTimeTaken <= silverTime) {
                    medal = "Silver";

                } else {
                    medal = "Bronze";

                }
                return medal;
            };


            // Calculates results
            function results() {

                    //swap background image
                    $('body').addClass('body-results');
                   
                    //stop Timer
                    $("#timeCounter").hide();
                    clearInterval(timerCtrl);

                    //show results area 
                    $("#questionArea").hide();
                    $("#currentQuestionDisplay").hide();
                    $('#resultsArea').show(); 
                    $('#resultsFeedback').show(); 


                    //work out total score
                    timePenaltyTotal = timePenaltyNumber*10;  
                    totalTimeTaken = seconds + timePenaltyTotal;
                    $('#resultsStar').removeClass().addClass(getmedal(totalTimeTaken));
                    $('#resultsMedal').html(getmedal(totalTimeTaken));
                    $('#resultsText').html("<div>Time taken: " + secondsToHms(seconds) + "<br> Penalties: " + timePenaltyNumber + " x " + timePenaltyTime +  " seconds <br> Total Score: " + secondsToHms(totalTimeTaken) + "</div>");



                //disable activity, update totalTimeTaken, hide start button
                $("#activityArea").children().attr('disabled', true);

                $('#resultsFeedback table td').remove();

                var listItem = "";
                for ( i = 0; i <= (numberofQuestions - 1); i++) {
                    var question  = questionsArray[i];
					//ADDED ZERO, SO IT TARGETS FIRT OBJECT IN MD ARRAY
                    var answer = answersArray[i][0];
                    var response = feedbackArray[i];
                    var attempts = answersCheckedArray[i];
                    listItem += "<tr><td>" + (i + 1) + "</td><td>" + question + "</td><td>" + answer + "</td><td>" + response + "</td><td>" + attempts + "</td></tr>";
                };
                $('#resultsFeedback table').append(listItem);
                
                //restart button and reset some variables
                $("#restartButton").show();
                seconds = 0;
                currentQuestion = 0;

                //$("#nextButton").hide();
                $("#checkAnswerButton").hide();
                $("#charactersArea").hide();
                $("#currentQuestionDisplay").hide();
                $("#nextButton").hide();
                $("#activityInfo").hide();                            

                
            }           


            // Start button
            $("#startButton").on('click', function(e) {
                startActivity();
            });

            // Restart button
            $("#restartButton").on('click', function(e) {
                startActivity();
            });

            // Next button
            $("#nextButton").on('click', function(e) {  
                nextQuestion();          
            });        


            // check Answer buttons
            $("#checkAnswerButton").on('click', function(e){
                checkAnswer(); 
            });

            
            $(".inputBox").on('keypress', function(e) {                
                if(e.keyCode==13){
                    checkAnswer();               
                }
            }); 


        };

    })

(jQuery);
