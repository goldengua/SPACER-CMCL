PennController.ResetPrefix(null); // Initiates PennController
SetCounter( "inc" , 1 )
//PennController.DebugOff()
// Start typing your code here
 // Initiates PennController

// Start typing your code here

Sequence( "consent","intro","welcome", "practice_intro", "practice","experiment_intro", randomize("experiment") ,"exit","send", "final" )
//for testing
//Sequence( "consent","intro","welcome", "practice_intro", "practice 1", "practice 2", "send" ,"exit", "final" )

newTrial("consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .print()
    ,
    newButton("continue", "Click to continue")
        .center()
        .print()
        .wait(getHtml("consent_form").test.complete()
                  
.failure(getHtml("consent_form").warn())
        )
)

newTrial("intro",
    newHtml("intro", "intro.html")
        .print()
        .log()
    ,
    newButton("continue", "Click to continue")
        .center()
        .print()
        .wait(getHtml("intro").test.complete()
.failure(getHtml("intro").warn())
        )
        ,
   getHtml("intro").log()
)

newTrial("welcome",
    newHtml("welcome", "welcome.html")  // Load the external HTML file
        .print()  // Print the content of the HTML file
    ,
    newButton("Start")
        .print()
        .wait()  // Wait for the participant to click the "Start" button
);

newTrial( "practice_intro" ,
    defaultText
        .print()
    ,
    newText("<p>Let's practice some sentences now. </p>")
    ,
    newButton("Continue")
        .print()
        .wait()
    )

Template( "practice.csv",variable =>

    newTrial( "practice",
    defaultText
        .print()
    ,
    newText("context",variable.context)
    ,
    newText("stimulus","<b>"+variable.stimulus+"</b><br>")
    ,
    newText("explanation","<br><i>Trial explained: "+variable.explanation+"</i> <br><br>")
    ,
    newTextInput("correction", variable.stimulus)
        .log()
        .lines(0)
        .size(Math.max(500, variable.stimulus.length * 10), 60) // Adjust size based on text length
        .print()
    ,
    newScale("score", 100)
    .slider()
    .before( newText("score label", "Confidence: ") )
    .after( newText("score text", " / 100") )
    .print()
    //.wait()
    .log()
    ,
newButton("Continue")
    .print()
    .wait(
        // First, check if the text input matches the expected correction
        // getText("error-text")?.remove(),
        // getText("error-scale")?.remove(),
        getTextInput("correction")
            .test.text(variable.target)
            .failure(
                newText("error-text", "The correction does not seem to be right. Please read the explanation above and try again.")
                    .color("red")
                    .print()
            )
            .and(getScale("score")
                .test.selected()
                .failure(
                    newText("error-scale", "Please adjust the slider to indicate your confidence before proceeding.")
                        .color("red")
                        .print()
                )
            )
        
    )

 )
.log('item',variable.item)
.log('uttrID',variable.uttrID)
.log('stimulus',variable.stimulus)
.log('context',variable.context)
.log('error',variable.error)
.log('target',variable.target)
)

newTrial( "experiment_intro" ,
    defaultText
        .print()
    ,
    newText("<p>This is the end of the practicce session. Now let us work on some real speech transcriptions. </p>")
    ,
    newButton("Continue")
        .print()
        .wait()
    )

Template( "fulldesign.csv",variable =>
    newTrial( "experiment",
    defaultText
        .print()
    ,
    newText("context",variable.context)
    ,
    newText("stimulus","<b>"+variable.stimulus+"</b><br><br>")
    ,
    newTextInput("correction", variable.stimulus)
        .log()
        .lines(0)
        .size(Math.max(500, variable.stimulus.length * 10), 60) // Adjust size based on text length
        .print()
    ,
    newScale("score", 100)
    .slider()
    .before( newText("score label", "Confidence: ") )
    .after( newText("score text", " / 100") )
    .print()
    //.wait()
    .log()
    ,
newButton("Continue")
    .print()
    .wait(

            getScale("score")
                .test.selected()
                .failure(
                    newText("error-scale", "Please adjust the slider to indicate your confidence before proceeding.")
                        .color("red")
                        .print()
                )
    )
         
)
.log('item',variable.item)
.log('uttrID',variable.uttrID)
.log('stimulus',variable.stimulus)
.log('context',variable.context)
.log('error',variable.error)
.log('error_uPOS',variable.error_uPOS)
.log('error_class',variable.error_class)
.log('repair',variable.repair)
.log('repair_uPOS',variable.repair_uPOS)
.log('repair_class',variable.repair_class)
.log('subs_position',variable.subs_position)
.log('target',variable.target)
.log('group',variable.group)
.log('condition',variable.condition)
)

newTrial("exit",
    newHtml("exit", "exit.html")
        .print()
        .log()
    ,
    newButton("continue", "Click to continue")
        .center()
        .print()
        .wait(getHtml("exit").test.complete()
                  
.failure(getHtml("exit").warn())
        )
    ,
   getHtml("exit").log("prolific_id")
)

SendResults( "send" )

newTrial( "final" ,
    newText("<p>Thank you for your participation! Your results have been successfully sent to the server. </p>")
        .print(),
    newButton("void")
        .wait()
    
)

//design some good pratice trials with excellent explanation

