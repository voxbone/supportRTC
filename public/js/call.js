$( document ).ready(function() {
    /** Onload disable buttons **/
    $( "#phone-dial" ).toggleClass( "spin", true );

    $("#dial").html('<i id="phone-dial" class="icon-phone"></i> Waiting');
    $( "#phone-dial" ).toggleClass( "spin", true );
    $( "#dial" ).toggleClass( "disabled", true );
    $( "#dial" ).attr('disabled', 'disabled');
    $( "#hangup" ).toggleClass( "disabled", true );
    $( "#hangup" ).attr('disabled', 'disabled');
    $( "#mute" ).toggleClass( "disabled", true );
    $( "#mute" ).attr('disabled', 'disabled');
    $( ".reception" ).toggleClass( "appear", false );
    $( ".reception-number" ).removeAttr( 'href' );
    //Listen whether the browser supports WebRTC or not
    if (voxbone.WebRTC.isWebRTCSupported()==false){
        $("body").html('<div class="browser-error"><p>This browser does not currently support WebRTC. Please use any of the following supported browsers:</p><ul><li><img src="assets/chrome.png" alt="" /><p>Chrome</p></li><li><img src="assets/firefox.png" alt="" /><p>Firefox</p></li><li><img src="assets/opera.png" alt="" /><p>Opera</p></li></div>');
    }
    //If permission for audio, launch init() otherwise show reminder
    else {
        showNotif();
    }
        showNotif();
});

// Register callbacks to desired call events
var eventHandlers = {

    'progress':   function(e){
                        $("#dial").html('<i id="phone-dial" class="icon-phone"></i> Calling');
                        $( "#phone-dial" ).toggleClass( "spin", true );
                        $( "#dial" ).toggleClass( "disabled", true );
                        $( "#dial" ).attr('disabled', 'disabled');
                        $( "#hangup" ).toggleClass( "disabled", false );
                        $( "#hangup" ).removeAttr('disabled', 'disabled');
                        $( "#mute" ).toggleClass( "disabled", false );
                        $( "#mute" ).removeAttr('disabled', 'disabled');
                        playRingback();
                    },
    'failed':     function(e){
                        //e.data.cause refers to the JSSIP failure causes
                        $( "#dial" ).html(e.data.cause);
                        $( "#dial" ).toggleClass( "incall", true );
                        $( "#dial" ).attr('disabled', 'disabled');
                        $( "#hangup" ).toggleClass( "disabled", true );
                        $( "#mute" ).toggleClass( "disabled", true );
                        timeout = setTimeout(function() {
                            $("#dial").html('<i class="icon-phone"></i>');
                            $( "#dial" ).removeAttr('disabled');
                            $( "#dial" ).toggleClass( "incall", false );
                            $( "#dial" ).toggleClass( "disabled", false );
                        }, 2500);

                        //Call Reception instead
                        if (e.data.cause == 'Busy' || e.data.cause == 'Unavailable' ){
                            $( ".reception" ).toggleClass( "appear", true );
                            $( ".reception-number" ).attr( 'href', "?number=18572946333");
                        }
                        stopRingback();
                        timeout = setTimeout(function() {
                            showAd();
                        }, 2000);
                    },
    'started':    function(e){
                        // Start stopwatch
                        stopwatch.startStop();
                        $( "#dial" ).toggleClass( "incall", true );
                        $( "#dial" ).attr('disabled', 'disabled');
                        stopRingback();
                    },
    'ended':      function(e){
                        // Stop stopwatch
                        stopwatch.startStop();

                        $("#dial").html('Call Ended');
                        $( "#hangup" ).toggleClass( "disabled", true );
                        $( "#mute" ).toggleClass( "disabled", true );
                        timeout = setTimeout(function() {
                                $( "#dial" ).toggleClass( "incall", false );
                                $( "#dial" ).toggleClass( "disabled", false );
                                $( "#dial" ).removeAttr('disabled');
                                showAd();
                            }, 2000);
                        timeout = setTimeout(function() {
                                $("#dial").html('<i class="icon-phone"></i>');
                            }, 2500);


                    }
};


/** This part is required as it handle Voxbone WebRTC initialization **/
function init(voxrtc_config, cid){
    // Set the webrtc auth server url (url below it the default one)
    voxbone.WebRTC.authServerURL = "http://webrtc.voxbone.com/rest/authentication/createToken";

    // Force the preferedPop to TEST.
    //This can be usefull if you need  to get your webrtc calls troubleshooted
    //If this is not set, a ping to each pop will be issued to determine which is the most optimal for the user
    //Default is to use the ping mechanism to determine the preferedPop.
    // voxbone.WebRTC.preferedPop = 'TEST';

    // set custom event handlers
    voxbone.WebRTC.customEventHandler = eventHandlers;

    //Set the caller-id, domain name gets automatically stripped off
    //Note that It must be a valid sip uri.
    //Default value is: voxrtc@voxbone.com
    voxbone.WebRTC.configuration.uri = cid + "@voxbone.com";

    //Bootstrap Voxbone WebRTC javascript object
    voxbone.WebRTC.init(voxrtc_config);
    console.log(voxrtc_config);
    /** Onload Wait for Auth then Make call **/
    callTimer = window.setInterval(function(){makeCall(cid)},1000);


    /** Onload disable buttons **/
    $( "#dial" ).toggleClass( "disabled", true );
    $( "#dial" ).attr('disabled', 'disabled');
    $( "#hangup" ).toggleClass( "disabled", true );
    $( "#hangup" ).attr('disabled', 'disabled');
    $( "#mute" ).toggleClass( "disabled", true );
    $( "#mute" ).attr('disabled', 'disabled');
    hideNotif();
};

/** Make call Event **/
var callTimer;
function makeCall(number){
        window.clearTimeout(callTimer);
        $( "#dial" ).html('<i id="phone-dial" class="icon-phone"></i> Dialing');

        voxbone.WebRTC.call(number);
        $( "#phone-dial" ).toggleClass( "spin", true );
        $( "#dial" ).toggleClass( "disabled", true );
        $( "#dial" ).attr('disabled', 'disabled');
        $( "#hangup" ).toggleClass( "disabled", true );
        $( "#mute" ).toggleClass( "disabled", true );
        //Terminate call when page refreshed/exited
            window.onbeforeunload=function(e){
                rtcSession.terminate();
            }
    hideNotif();

};

/**
    UX Stuff
**/

/* Show/Hide Permission Notification */
function showNotif(){
    $( "#notification" ).toggleClass( "appear", true );
    $( "#notification" ).removeAttr( 'disabled', 'disabled' );
}
function hideNotif(){
    $( "#notification" ).toggleClass( "appear", false );
    $( "#notification" ).attr( 'disabled', 'disabled' );
}
/* Show/Hide Permission Notification */
function showAd(){
    $( "#ad" ).toggleClass( "appear", true );
    $( "#ad" ).removeAttr( 'disabled', 'disabled' );
}
function hideAd(){
    $( "#ad" ).toggleClass( "appear", false );
    $( "#ad" ).attr( 'disabled', 'disabled' );
}

/** Toggling mute **/
function toggleMute(){
    var button = document.getElementById("mute");
    if( voxbone.WebRTC.isMuted ){
        voxbone.WebRTC.unmute();
        button.value = "mute";
        $( "#mute" ).toggleClass( "muted", false );

    }else{
        voxbone.WebRTC.mute();
        button.value = "unmute";
        $( "#mute" ).toggleClass( "muted", true );

    }
}

/** Call timer **/
var stopwatch = new Stopwatch(function(runtime) {
   // format time as m:ss
   var minutes = Math.floor(runtime / 60000);
   var seconds = Math.floor(runtime % 60000 / 1000);
   var displayText = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
   $("#dial").html("In Call " + displayText);
});

/** Play/Pause Ringbacktone **/
var audio = new Audio('assets/US_ringback_tone.ogg');

function playRingback(){
    audio.loop = true;
    audio.play();
}
function stopRingback(){
    audio.loop = true;
    audio.pause();
}

