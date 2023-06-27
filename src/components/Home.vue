<template>
  <main v-if="loaded" id="main_div">

    <!-- event found -->
    <div v-if="is_event_found">

      <!-- <textarea name="" id="" cols="30" rows="10">{{JSON.stringify(eventInfo)}}</textarea> -->
      
      <div class="container" id="heading_title">
        <header>
          <h1 class="white text-center">{{eventInfo.meeting_title}}</h1>
        </header>
      </div>

      <br>


      <!-- Body : desktop -->
      <div class="container" v-if="is_event_found" id="desc_desktop">
        <!-- Enter name & submit -->
        <div class="row" v-if="is_event_started && !is_event_ended" id="desk_join">
          <div class="col-xs-8 col-sm-6 name_txt" style="padding: 0;">
              <input type="text" class="form-control" placeholder="Your name" v-model="userName" id="desk_join_usn"/>
          </div>
          <div class="col-xs-4 col-sm-6 join_btn">
              <button type="button" class="btn btn-primary" @click="getSignature" id="btn_join">Join</button>
          </div>
        </div>
  
        <!-- image and desc -->
        <div class="row" style="margin-top: 15px;">
          <p class="col-md-6 col-sm-12 col-xs-12" id="mobile_event_img">
            <img class="img-responsive img-thumb" 
            :src="eventInfo.image_url" style="padding: 0;"/>
          </p>
  
          <div class="col-md-6 col-sm-12 col-xs-12 para_txt">
            <div style="color: white; " class="event_desc">
              <!-- event desc here -->
              <span v-html="eventInfo.description"></span>
            </div>

            <br>

            <div id="evt_info">
              <form class="form-inline" disabled>
                <div class="form-group" id="bfore_event_started">
                  <label>Event date</label>
                  <p><span class="glyphicon glyphicon-calendar" style="color:white;"></span> {{eventOn}}</p>
                </div>
                <div class="event_on_info">
                  <h4 v-if="!is_event_started" id="event_started">
                    Event has not started yet
                  </h4>
                  <h4 v-else-if="is_event_ended" id="event_started">
                    Event has ended
                  </h4>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      <!-- Body : mobile -->
      <div class="container" v-if="is_event_found" id="desc_mobile">
        <!-- Enter name & submit -->
        <div class="row" v-if="is_event_started && !is_event_ended" id="desk_join">
          <div class="col-xs-4 name_txt">
              <input type="text" class="form-control" placeholder="Your name" v-model="userName" style="margin-left: 15px;" id="desk_join_usn"/>
          </div>
          <div class="col-xs-4 join_btn">
              <button type="button" class="btn btn-primary" @click="getSignature">Join</button>
          </div>
        </div>
  
        <!-- image and desc -->
        <div class="row" style="margin-top: 15px;">
          <p class="col-md-6 col-sm-12 col-xs-12" id="mobile_event_img">
            <img class="img-responsive"  
            :src="eventInfo.image_url" style="padding: 0;"/>
          </p>
  
          <div class="col-md-6 col-sm-12 col-xs-12 para_txt">
            <div style="color: white; " class="event_desc">
              <!-- event desc here -->
              <span v-html="eventInfo.description"></span>
            </div>

            <br>

            <div id="evt_info">
              <form class="form-inline" disabled>
                <div class="form-group" id="bfore_event_started">
                  <label>Event date</label>
                  <p><span class="glyphicon glyphicon-calendar" style="color:white;"></span> {{eventOn}}</p>
                </div>
                <div class="event_on_info">
                  <h4 v-if="!is_event_started" id="event_started">
                    Event has not started yet
                  </h4>
                  <h4 v-else-if="is_event_ended" id="event_started">
                    Event has ended
                  </h4>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>


    </div>










    <!-- event not found -->
    <div v-else>
      <div class="container">
        <h1 style="text-align: center; color: white;">Event not Found</h1>
      </div>
    </div>

  </main>
</template>

<script>
import axios from "axios";
import { ZoomMtg } from '@zoomus/websdk';
import moment from "moment-timezone"
import { decode } from 'js-base64';

import {mixin as VueTimers} from 'vue-timers'


import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import Vue from 'vue'

Vue.use(Toast, {
  // registration props here
   // top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
  position: 'bottom-right',

  // place newest toast on the top
  newestOnTop: true,

  // the max number of toasts
  maxToasts: 1,

  // name of the Vue Transition or object with classes to use
  // only enter-active, leave-active and move are applied.
  transition: 'Vue-Toastification__bounce',

  // duration in ms
  // or an object: {enter: Number, leave: Number}
  transitionDuration: 750,

  // allows to dismiss by drag & swipe events
  draggable: true, 
  draggablePercent: 0.6,

  // auto pause when out of focus
  pauseOnFocusLoss: true,

  // auto pause on hover
  pauseOnHover: true,

  // close on click
  closeOnClick: true,

  // auto dismiss after this timeout
  timeout: 5000,

  // container element
  container: document.body,

  // custom classes
  toastClassName: [],

  // body classes
  bodyClassName: [],

  // show/hide the progress bar
  hideProgressBar: false,

  // show/hide the close button
  hideCloseButton: false,

  // custom icons here
  icon: true

});

export default {
  name: 'Meeting',
  mixins: [VueTimers],
  timers: {
    getEventInfo: { time: 10000, autostart: false, repeat: true, immediate: true },
  },
  created () {
    
    let meeting_id  = this.$route.query.meeting_id
    let name        = this.$route.query.name
    let pwd         = this.$route.query.pwd
    let signature   = this.$route.query.signature
    let event_id   = this.$route.query.event_id

    console.clear()
    console.log('#######################')
    console.log(event_id)

    if(!event_id && !meeting_id && !pwd && !signature){
      alert('Please re-check the link')
    }

    event_id  = decode(event_id)
    meeting_id  = decode(meeting_id)
    name        = decode(name)
    pwd         = decode(pwd)
    signature   = decode(signature)


    this.event_id = event_id
    this.$timer.start('getEventInfo') 
    // this.getEventInfo(event_id)
    this.userName = name || ''
    this.passWord = pwd

    this.meetingNumber = meeting_id
  },
  mounted() {

    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.8.0/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    // loads language files, also passes any error messages to the ui
    ZoomMtg.i18n.load('en-US');
    ZoomMtg.i18n.reload('en-US');

    ZoomMtg.inMeetingServiceListener("onUserJoin", (data) => {
      console.log("inMeetingServiceListener onUserJoin", data);
    });
  },
  data () {
    return {
      // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
      sdkKey: "mMy94L4nRW6UFnZrvADc7IPvoz11LgSa",
      leaveUrl: "https://events.ledexapp.co.in/thank-you.html",
      meetingNumber: "",
      passWord: "",
      role: 0,
      signatureEndpoint: process.env.VUE_APP_API_URL+'/gen-sign',
      userEmail: "",
      userName: "",
      // pass in the registrant's token if your meeting or webinar requires registration. More info here:
      // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/meetings#join-registered
      // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/webinars#join-registered
      registrantToken: '',
      eventName: '',

      is_event_started: false,
      is_event_ended: false,

      eventInfo: null,
      event_id: 0,

      is_event_found: false,
      loaded: false,
      prev_state: 'no-join'
    }
  },
  methods: {
    getEventInfo(){
      let url = process.env.VUE_APP_API_URL+'/events?event_id='+this.event_id

      this.$root.$emit('show-loader')
      axios.get(url).then((res)=>{
        this.$root.$emit('hide-loader')

        this.is_event_found = true

        let evt = res.data

        if(!evt){
          return this.$toast.error("Could not get event details");
        }

        this.eventInfo = evt

        console.log(evt)

        console.log([moment().unix(), moment(evt.event_time).unix()])
        //start date
        if(moment().unix()<moment(evt.event_time).unix()){
          this.is_event_started = false
        }else{
          this.is_event_started = true
        }

        console.log([moment().unix(), moment(evt.event_closes_on).unix()])
        //end date
        if(moment().unix()>moment(evt.event_closes_on).unix()){
          this.is_event_ended = true
        }else{
          this.is_event_ended = false
        }


        //Zoom based meeting check
        if(evt.meeting_started){
          this.is_event_started = true
        }

        if(evt.meeting_ended){
          this.is_event_ended = true
        }

        if(this.is_event_started && !this.is_event_ended){
          if(this.prev_state != 'join'){
            this.$toast.success("Event has started, please join");
            this.prev_state = 'join'
          }
        }

        if(this.is_event_ended){
          if(this.prev_state != 'no-join'){
            this.$toast.error("Sorry, event has ended");
            this.prev_state = 'no-join'
          }
          // this.$timer.stop('getEventInfo') 
        }

      })
      .catch((e)=>{
        console.error(e)
        this.is_event_found = false
        this.$root.$emit('hide-loader')
      })
      .then(()=>{
        this.loaded = true
      })

    },
    getSignature() {

      if(String(this.passWord).trim() == ''){
        return alert('Please provide passcode')
      }

      if(String(this.meetingNumber).trim() == ''){
        return alert('Please provide meeting id')
      }

      this.$root.$emit('show-loader')
      axios.get(this.signatureEndpoint+'?meeting_id='+this.meetingNumber, {
        // meetingNumber: this.meetingNumber,
        // role: this.role
      })
      .then(res => {
        this.$root.$emit('hide-loader')
        console.log(res.data.sign);
        this.$timer.stop('getEventInfo') 
        this.startMeeting(res.data.sign);
      })
      .catch(error => {
        this.$root.$emit('hide-loader')
        console.log(error);
      });
    },
    startMeeting(signature) {

      let leave_url = process.env.VUE_APP_BASE_URL+'/thanks?'
        +'event_id='          +this.$route.query.event_id
        +'&meeting_id='       +this.$route.query.meeting_id
        +'&name='             +this.$route.query.name
        +'&pwd='              +this.$route.query.pwd
        +'&signature='        +this.$route.query.signature
        +'&employee_id='      +this.$route.query.employee_id
        +'&chime_meeting_id=' +this.$route.query.chime_meeting_id

      
      this.$router.push({
        name: 'Room',
        params: {
            leave_url,
            meetingNumber:  this.meetingNumber,
            userName:       this.userName,
            sdkKey:         this.sdkKey,
            // userEmail: this.userEmail,
            passWord:       this.passWord,
            tk:             this.registrantToken,
            
            chime_meeting_id: this.$route.query.chime_meeting_id,
            employee_id:    this.$route.query.employee_id,
            signature:      signature,


        }
      });

      /*
      ZoomMtg.init({
        leaveUrl: leave_url,

        success: (success) => {
          console.log(success);

          ZoomMtg.showInviteFunction({
            show: false
          });

          ZoomMtg.join({
            meetingNumber: this.meetingNumber,
            userName: this.userName,
            signature: signature,
            sdkKey: this.sdkKey,
            // userEmail: this.userEmail,
            passWord: this.passWord,
            tk: this.registrantToken,
            success: (success) => {
              console.log(success);
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
      */


    }
  },
  computed:{
    eventOn(){
      if(!this.eventInfo){
        return '-'
      }else{
        let zone = moment.tz.guess()
        let abbr = moment.tz(zone).zoneAbbr()

        return moment(this.eventInfo.event_time).format('Do MMMM YYYY, h:mm A') + ' ' + abbr;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
 .event_desc {
  font-style: italic;
 }




@media (min-width: 768px){
  #desc_desktop { display: block; }
  #desc_mobile { display: none; }
  #heading_title h1 { text-align: center; }
}



@media (max-width: 991px){
  .event_desc { width: 600px; }
}


@media (max-width: 767px){
  #desc_desktop { display: none; }
  #desc_mobile { display: block; }
  #heading_title h1 { text-align: left; }
}






 


/******* detailed /*******/


/* max width 991 */
@media (max-width: 991px){
 
  #mobile_event_img
  {
    width: 600px;
  }

  #mobile_event_img img
  {
    width: 100%;
  }

 
  #heading_title header{
    width: 600px;
  }

  #heading_title h1{
    width: 600px;
  }
 
  .event_desc {
    width: 600px;
  }

  .para_txt{
    padding: 0;
  }

  .join_btn {
    text-align: end;
  }

  #desk_join{
    width: 614px;
  }

  #desk_join_usn{
    width: 430px;
    height: 40px;
  }

  #btn_join {
    width: 150px;
  }
}


/* max width 900 */
@media (max-width: 900px){
 
  #mobile_event_img
  {
    width: 600px;
  }

  #mobile_event_img img
  {
    width: 100%;
  }

 
  #heading_title header{
    font-size: 24px;
    width: 600px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 600px;
  }
 
  .event_desc {
    width: 600px;
  }

  .para_txt{
    padding: 0;
  }

  .join_btn {
    text-align: end;
  }

  #desk_join{
    width: 614px;
  }

  #desk_join_usn{
    width: 430px;
    height: 40px;
  }
}

/* max width 800 */
@media (max-width: 800px){
  #main_div {
    width: 800px;
  }

  #mobile_event_img
  {
    width: 750px;
  }

  #mobile_event_img img
  {
    width: 100%;
  }


  #heading_title header{
    font-size: 24px;
    width: 800px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 780px;
  }

  .event_desc {
    width: 750px;
  }

  .para_txt{
    padding: 0;
  }

  .join_btn {
    text-align: end;
  }


  #desk_join_usn{
    width: 580px;
    height: 40px;
  }

  #btn_join{
    margin-left: 276px;
  }
}


/* max width 768 */
@media (max-width: 768px){
  #main_div {
    width: 768px;
  }

  #mobile_event_img
  {
    width: 700px;
  }

  #mobile_event_img img
  {
    width: 100%;
  }
  
  #heading_title header{
    font-size: 24px;
    width: 768px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 748px;
  }

  .event_desc {
    width: 680px;;
  }

  .join_btn {
    text-align: end;
    margin-left: -90px;
  }

  #desk_join_usn{
    width: 540px;
    height: 40px;
  }

  .para_txt{
    padding: 10px;
  }

  #desk_join{
    width: 700px;
  }
}


/* max width 767 */
@media (max-width: 767px){
  #main_div {
    width: 767px;
  }

  #mobile_event_img, #mobile_event_img img
  {
    width: 767px;
  }

  #heading_title header{
    font-size: 24px;
    width: 767px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 747px;
  }

  .event_desc {
    width: 747px;
  }

  .join_btn {
    text-align: end;
    margin-left: 250px;
  }

  #desk_join_usn{
    width: 600px;
    height: 40px;
  }

  .para_txt{
    padding: 10px;
  }


  #desk_join {
    width: 750px;
  }
}


/* max width 750 */
@media (max-width: 750px){
  #main_div {
    width: 750px;
  }

  #mobile_event_img, #mobile_event_img img
  {
    width: 750px;
  }

  #heading_title header{
    font-size: 24px;
    width: 750px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 730px;
  }

  .event_desc {
    width: 730px;
  }

  .join_btn {
    text-align: end;
    margin-left: 250px;
  }

  #desk_join_usn{
    width: 600px;
    height: 40px;
  }

  .para_txt{
    padding: 10px;
  }


  #desk_join {
    width: 750px;
  }
}

/* max width 640 */
@media (max-width: 640px){
  #main_div {
    width: 640px;
  }

  #mobile_event_img, #mobile_event_img img
  {
    width: 640px;
  }

  #heading_title header{
    font-size: 24px;
    width: 640px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 620px;
  }

  .event_desc {
    width: 620px;
  }

  .join_btn {
    text-align: end;
    margin-left: 50px;
  }

  #desk_join_usn{
    width: 305px;
    height: 40px;
  }

  .para_txt{
    padding: 10px;
  }


  #desk_join {
    width: 620px;
  }
}


/* max width 600 */
@media (max-width: 600px){
  #main_div {
    width: 600px;
  }

  #mobile_event_img
  {
    width: 600px;
  }

  #heading_title header{
    font-size: 24px;
    width: 600px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 580px;
  }

  .event_desc {
    width: 580px;
  }

  .join_btn {
    text-align: end;
    margin-left: 100px;
  }

  #desk_join_usn {
    width: 455px;
    height: 40px;
  }
 
}

/* max width 540 */
@media (max-width: 540px){
  #main_div {
    width: 540px;
  }

  #mobile_event_img
  {
    width: 540px;
  }

  #heading_title header{
    font-size: 24px;
    width: 540px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 520px;
  }

  .event_desc {
    width: 520px;
  }

  .join_btn {
    text-align: end;
    margin-left: 130px;
  }

  #desk_join_usn {
    width: 385px;
    height: 40px;
  }
 
}

/* max width 500 */
@media (max-width: 500px){
  #main_div {
    width: 500px;
  }

  #mobile_event_img
  {
    width: 500px;
  }

  #heading_title header{
    font-size: 24px;
    width: 500px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 480px;
  }

  .event_desc {
    width: 480px;
  }

  .join_btn {
    text-align: end;
    margin-left: 0px;
  }

  #desk_join_usn {
    width: 355px;
    height: 40px;
  }
 
}


/* max width 480 */
@media (max-width: 480px){
  #main_div {
    width: 480px;
  }

  #mobile_event_img
  {
    width: 480px;
  }

  #heading_title header{
    font-size: 24px;
    width: 480px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 460px;
  }

  .event_desc {
    width: 460px;
  }

  .join_btn {
    text-align: end;
    margin-left: -20px;
  }

  #desk_join_usn  {
    width: 330px;
    height: 40px;
  }
}

/* max width 414 */
@media (max-width: 414px){
  #main_div {
    width: 414px;
  }

  #mobile_event_img
  {
    width: 414px;
  }

  #heading_title header{
    font-size: 24px;
    width: 414px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 394px;
  }

  .event_desc {
    width: 394px;
  }

  .join_btn {
    text-align: end;
  }

  #desk_join_usn {
    width: 215px;
    height: 40px;
  }

  .join_btn {
    margin-left: -38px;
  }

  #mobile_event_img img {
    width: 345px;
  }
}

/* max width 412 */
@media (max-width: 412px){
  #main_div {
    width: 412px;
  }

  #mobile_event_img
  {
    width: 412px;
  }

  #heading_title header{
    font-size: 24px;
    width: 412px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 392px;
  }

  .event_desc {
    width: 392px;
  }

    .join_btn {
    text-align: end;
  }

  #desk_join_usn {
    width: 260px;
    height: 40px;
  }

  .join_btn {
    margin-left: 0px;
  }

  #mobile_event_img img {
    width: 385px;
  }
}

/* max width 393 */
@media (max-width: 393px){
  #main_div {
    width: 393px;
  }

  #mobile_event_img
  {
    width: 393px;
  }

  #heading_title header{
    font-size: 24px;
    width: 393px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 373px;
  }

  .event_desc {
    width: 373px;
  }

  .join_btn {
    text-align: end;
  }

  #desk_join_usn {
    width: 245px;
    height: 40px;
  }

  .join_btn {
    margin-left: -20px;
  }

  #mobile_event_img img {
    width: 365px;
  }
}

/* max width 390 */
@media (max-width: 390px){
  #main_div {
    width: 390px;
  }

  #mobile_event_img
  {
    width: 390px;
  }

  #heading_title header{
    font-size: 24px;
    width: 390px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 370px;
  }

  .event_desc {
    width: 350px;
  }

  .join_btn {
    text-align: end;
    margin-left: -38px;
  }

  #desk_join_usn {
    width: 225px;
    height: 40px;
  }


}


/* max width 375 */
@media (max-width: 375px){
  #main_div {
    width: 375px;
  }

  #mobile_event_img
  {
    width: 375px;
  }

  #heading_title header{
    font-size: 24px;
    width: 375px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 355px;
  }

  .event_desc {
    width: 355px;
  }

  .join_btn {
    text-align: end;
  }

  #desk_join_usn {
    width: 215px;
    height: 40px;
  }

  .join_btn {
    margin-left: -38px;
  }
}


/* max width 360 */
@media (max-width: 360px){
  #main_div {
    width: 360px;
  }

  #mobile_event_img
  {
    width: 360px;
  }

  #heading_title header{
    font-size: 24px;
    width: 360px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 340px;
  }

  .event_desc {
    width: 340px;
  }

  .join_btn {
    text-align: end;
    margin-left: -52px;
  }

  #desk_join_usn {
    width: 210px;
    height: 40px;
  }


}


/* max width 280 */
@media (max-width: 280px){
  #main_div {
    width: 280px;
  }

  #mobile_event_img
  {
    width: 280px;
  }

  #heading_title header{
    font-size: 24px;
    width: 280px;
  }

  #heading_title h1{
    font-size: 24px;
    width: 260px;
  }

  .event_desc {
    width: 280px;
  }

  .join_btn {
    text-align: end;
    margin-left: -132px;
  }

  #desk_join_usn {
    width: 135px;
    height: 40px;
  }


}


#desc_mobile {
  /* 
  background-color: grey; 
  */
}

body {
  overflow-y: scroll;
}

.name_txt {
padding-left: 0;
}

 

main button {
  background-color: #2D8CFF;
  color: #ffffff;
  text-decoration: none;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 40px;
  padding-right: 40px;
  display: inline-block;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  outline: none;
}

 

.white { color: #ffffff; }

#wc-footer, .single-main-container__main-view {
    background-color: #1c55a2;
}

#wc-footer{ border: 1px solid gray; }

#settingsDialog{ background-color: #1c55a2; }

 

#evt_info{
  color: white;
}

.event_on_info{
  color: white;
}

.event_on_info h4{
  margin: 0;
  padding: 10px;
  border: 2px dashed grey;
  display: inline-block;
}


#desc_desktop p   { padding: 0; }
 
 
</style>
