<template>
  <div></div>
</template>

<script>
import { ZoomMtg } from '@zoomus/websdk';

import axios from "axios";

const meetingRoot = document.getElementById('zmmtg-root')

export default {
  name: 'Room',

  props: ['leave_url', 'meetingNumber', 'userName', 'signature', 'sdkKey', 'passWord', 'registrantToken'],

  created () {
    // To show
    meetingRoot.style.display = 'block';
  },

  mounted() {

    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    // loads language files, also passes any error messages to the ui
    ZoomMtg.i18n.load('en-US');
    ZoomMtg.i18n.reload('en-US');

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.8.0/lib', '/av');

    ZoomMtg.inMeetingServiceListener("onUserJoin", (data) => {
      console.log("inMeetingServiceListener onUserJoin", data);
    });

    ZoomMtg.init({

      leaveUrl: this.leave_url,

      success: (success) => {
        this.scrollPreview()

        ZoomMtg.showInviteFunction({
          show: false
        });

        ZoomMtg.join({
          signature:      this.signature,
          meetingNumber:  this.meetingNumber,
          userName:       this.userName,
          sdkKey:         this.sdkKey,
          // userEmail: this.userEmail,
          passWord:       this.passWord,
          tk:             this.registrantToken,
          success: (success) => {
            this.giveAttendance()
          },
          error: (error) => {
            console.log(error);
          }
        });
      },

      error: (error) => {
        console.log(error);
      }

    });
  },
  data () {
    return {

    }
  },
  methods: {
    scrollPreview () {
      if(document.body.scrollIntoView){
        document.getElementById("media-preview-camera-on").scrollIntoView();
      }
    },
    giveAttendance(){
      let url = process.env.VUE_APP_API_URL+'/event-attendance'
      axios.post(url, {
        chime_meeting_id  :   this.chime_meeting_id,
        employee_id       :   this.employee_id,
        entry_signature   :   this.signature,
        device_type       :   3
      })
    }
  },
  computed:{
 
  }
}
</script>
 

<style scoped>

  #content_container{
    height: 600px!important;
  }

  .join-dialog__close {
    zoom: 2;
  }

</style>}
