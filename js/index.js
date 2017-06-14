//https://www.soundjay.com/misc/small-bell-ring-01a.mp3
$('document').ready(function(){
   
   // DOMs 
   var second = $('.second');
   var minute = $('.minute');
   var hour = $('.hour');
   var status = $('.status');
   
   var startBtn = $('button.start');
   var resetBtn = $('button.reset');
   var restPlus = $('.rest .plus');
   var restMinus = $('.rest .minus');
   var sessionPlus = $('.interval .plus');
   var sessionMinus = $('.interval .minus');
   
   var sessionInput = $('.interval .input');
   var restInput = $('.rest .input');
   
   var sound = new Audio("https://www.soundjay.com/misc/small-bell-ring-01a.mp3");
   var session;
   var rest;
   var intervalId;
   var total;
   var s;
   var m;
   var h;
   
   var accu = 0;
   var elapse = 0;
   var sessionState = 0; // 0 when run the session timer run, 1 is when run the rest timer
   var btnState = 0; // 0: stop - 1: running - 2:pause

   function run() {
      var start = Date.now();
      
      console.log("sessionState:", sessionState);

      if ( sessionState === 0 ) {
         total = session * 60 * 1000;
         $('.pie .half').removeClass('coral');
         status.text('Session');
      }
      else if ( sessionState === 1 ) {
         total = rest * 60 * 1000;
         status.text('Break');
      }

      function repeat() {
         elapse = accu + Date.now() - start;
         var remain = total - elapse;

         if ( remain <= 0 ) {
            remain = 0;
            sound.play();
            clearTimeout(intervalId);
            if ( sessionState === 0 ) {
               accu = 0;
               sessionState = 1;
               console.log("sessionState:", sessionState);
               run();
            }
            else if ( sessionState === 1 ) {
               status.text('Done');
               $('.pie .left-side').css('transform', 'rotate(360deg)');
               accu = 0;
               // elapse = 0;
               btnState = 0;
               sessionState = 0;
               startBtn.text("Redo");
               $('.display').text("00:00:00");
            }

         }
         else {
            s = Math.ceil(remain/1000)%60;
            
            if ( elapse < 1000 ) {
               m = Math.ceil(remain/60000)%60;
            }
            else {
               m = Math.floor(remain/60000)%60;
            }
            if ( s === 0 && m ===0 ) {
               h = Math.ceil(remain/3600000);
            }
            else {
               h = Math.floor(remain/3600000);
            }
            
            if ( s < 10 ) { s = "0" + s; }
            if ( m < 10 ) { m = "0" + m; }
            if ( h < 10 ) { h = "0" + h; }
            
            $('.display').text(h + ":" + m + ":" + s);
            
            if ( sessionState === 0 ) {
               status.text('Session');
            }
            else if ( sessionState === 1 ) {
               status.text('Break');
               $('.pie .half').addClass('coral');
            }
            
            $('.pie .left-side').css('transform', 'rotate('+ elapse*360/total +'deg)');
            if ( elapse/total*100 >= 50 ) {
               $('.pie').addClass('full');
            }
            else {
               $('.pie').removeClass('full');
            }
            
            intervalId = setTimeout(repeat,100);
         }  
         // $('.debug').text(remain + " = " + total + " - " + elapse  + ". Accumulate: " + accu ); // For debugging
      };
      intervalId = setTimeout(repeat,100);
   }

   function pause() {
      clearTimeout(intervalId);
      accu = elapse;
   }
   
   // Switch between Start/Resume and Pause
   //----------------------------------------------------------------------------------------
   startBtn.on('click', function(){
      // Start/Resume
      if ( btnState === 0 || btnState === 2 ) {
         btnState = 1;
         startBtn.text("Pause");
         session = parseInt(sessionInput.text());
         rest = parseInt(restInput.text());
         run();
         console.log("btnState",btnState);

      }
      // Pause Button
      else if ( btnState === 1 ) {
         btnState = 2;
         sessionInput.removeAttr('disabled');
         restInput.removeAttr('disabled');
         startBtn.text("Start");
         pause();
         console.log("btnState",btnState);
      }
   });
   // RESET button
   //---------------------------------------------------------------------------------------
   resetBtn.on('click', function(){
      clearTimeout(intervalId);
      accu = 0;
      elapse = 0;
      sessionState = 0; // 0 when run the session timer run, 1 is when run the rest timer
      btnState = 0;
      sessionInput.text('25');
      restInput.text('5');
      startBtn.text("Start");
      status.text('');
      $('.display').text('');
      $('.pie').removeClass('full');
      $('.pie .left-side').css('transform', 'rotate(0deg)');
      console.log("btnState",btnState);
   });
   
   var sessionIncrease = function() {
      if ( btnState !== 1 ) {
         if ( sessionState === 1 ) {
            return;
         }
         else if ( status.text() === "Done" ) {
               startBtn.text("Start");
         }
         else if ( btnState === 2 && sessionState === 0 ) {
            accu = 0;
         }
         var temp = sessionInput.text();
         temp++;
         sessionInput.text(temp);
      }
      
      else {
         return;
      }
   };
   var sessionDecrease = function(){
      if ( btnState !== 1 ) {
         if ( sessionInput.text() < 2 ) {
            return;
         }
         else if ( sessionState === 1 ) {
               return;
         }
         else if ( status.text() === "Done" ) {
               startBtn.text("Start");
         }
         else if ( btnState === 2 && sessionState === 0 ) {
            accu = 0;
         }
         var temp = sessionInput.text();
         temp--;
         sessionInput.text(temp.toString());
      }
      else {
         return;
      }
   };
   
   var timeoutId = 0; // This var is used for all plus and minus button of session and rest
   
   sessionPlus.on('click', sessionIncrease);
   sessionPlus.on('mousedown touchstart', function() {
       timeoutId = setInterval(sessionIncrease, 100);
   }).on('mouseup mouseleave touchend touchcancel', function() {
       clearInterval(timeoutId);
   });
   
   sessionMinus.on('click', sessionDecrease);
   sessionMinus.on('mousedown touchstart', function() {
       timeoutId = setInterval(sessionDecrease, 100);
   }).on('mouseup mouseleave touchend touchcancel', function() {
       clearInterval(timeoutId);
   });
   
   
   var restIncrease = function(){
      if ( btnState !== 1 ) {
         if ( status.text() === "Done" ) {
               startBtn.text("Start");
         }
         else if ( btnState === 2 && sessionState === 1 ) {
            accu = 0;
         }
         var temp = restInput.text();
         temp++;
         restInput.text(temp);
      }
      else {
         return;
      }
   };
   var restDecrease = function(){
      if ( btnState !== 1 ) {
         if ( restInput.text() < 2 ) {
            return;
         }
         else if ( status.text() === "Done" ) {
               startBtn.text("Start");
         }
         else if ( btnState === 2 && sessionState === 1 ) {
               accu = 0;   
         }
         var temp = restInput.text();
         temp--;
         restInput.text(temp.toString());
      }
      else {
         return;
      }
   }
   
   restPlus.on('click', restIncrease);
   restPlus.on('mousedown touchstart', function() {
       timeoutId = setInterval(restIncrease, 100);
   }).on('mouseup mouseleave touchend touchcancel', function() {
       clearInterval(timeoutId);
   });
   
   restMinus.on('click', restDecrease);
   restMinus.on('mousedown touchstart', function() {
       timeoutId = setInterval(restDecrease, 100);
   }).on('mouseup mouseleave touchend touchcancel', function() {
       clearInterval(timeoutId);
   });
});