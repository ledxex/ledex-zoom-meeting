<template>
        
    <main v-if="loaded" class="container">

        
        <div v-if="is_event_found">
            <div>
                <header v-if="!is_already_rated">
                    <h3 class="white text-center" style="font-size: 2.1em;">Thank you for joining</h3>
                    <h1 class="white text-center evt_name" style="font-size: 4.5em;">{{eventInfo.meeting_title}}</h1>
                </header>

                <section id="rating_panel" v-if="!is_already_rated">
                    <h3 style="margin-top: 80px;">Please rate you experience</h3>
                    <star-rating v-model="rating" :show-rating="false"></star-rating>
                    <div style="text-align: center; margin-top: 30px;">
                        <textarea class="form-control" style="display: inline-block;width: 250px;" placeholder="Your comments" v-model="comments"></textarea>
                    </div>

                    <div class="rating_container">
                        <button class="btn btn-primary" @click="submit" v-if="rating!=0">Submit</button>
                    </div>

                    
                </section>
                <section v-else>
                    <h3 class="white text-center" id="thank_rating">Thank you</h3>
                </section>
            </div>
        </div>

        <div v-else>
            <div class="container">
                <h1 style="text-align: center; color: white;">Event not Found</h1>
            </div>
        </div>

    </main>

</template>


<script>
import VueStarRating from 'vue-star-rating'
import axios from "axios";
import moment from "moment-timezone"
import { decode } from 'js-base64';

export default {
    name: 'Thanks',
    components: {
        'star-rating': VueStarRating
    },
    data(){
        return{
            feedback: 1,
            loaded: false,
            is_event_found: false,
            rating: 0,
            event_id: 0,
            meeting_id: 0,
            signature: 0,
            is_already_rated: true,
            employee_id: 0,
            chime_meeting_id: 0,
            comments: ''
        }
    },
    created () {
        let meeting_id  = this.$route.query.meeting_id
        let name        = this.$route.query.name
        let pwd         = this.$route.query.pwd
        let signature   = this.$route.query.signature
        let event_id   = this.$route.query.event_id
        let employee_id   = this.$route.query.employee_id
        let chime_meeting_id   = this.$route.query.chime_meeting_id


        if(!event_id && !meeting_id && !pwd && !signature){
            // alert('Please re-check the link')
        }

        event_id  = decode(event_id)
        meeting_id  = decode(meeting_id)
        name        = decode(name)
        pwd         = decode(pwd)
        signature   = decode(signature)
        employee_id   = decode(employee_id)
        chime_meeting_id   = decode(chime_meeting_id)


        console.clear()
        console.log('#######################')
        console.log({event_id, meeting_id, name, pwd, signature, employee_id, chime_meeting_id})

        this.getEventInfo(event_id)
        this.userName = name || ''
        this.passWord = pwd
        this.employee_id = employee_id
        this.chime_meeting_id = chime_meeting_id
        this.signature = signature

        this.meetingNumber = meeting_id

        this.getRating() // check rating given or not
    },
    methods: {
        getRating(){
            let url = process.env.VUE_APP_API_URL+'/event-rating'
            this.$root.$emit('show-loader')
            axios.get(url   +   '?chime_meeting_id='+this.chime_meeting_id  
                            +   '&employee_id='+this.employee_id
                            +   '&entry_signature='+this.signature)
            .then((res)=>{
                if(res.data.has_rated){
                    this.is_already_rated = true
                }else{
                    this.is_already_rated = false
                }
             })
            .catch((e)=>{
                console.error(e)
            })
            .then(()=>{
                this.$root.$emit('hide-loader')
            })
        },
        submit(){
            let url = process.env.VUE_APP_API_URL+'/event-rating'
            this.$root.$emit('show-loader')
            axios.post(url, { 
                rating: this.rating, 
                comments: this.comments,
                chime_meeting_id: this.chime_meeting_id, 
                employee_id: this.employee_id, 
                entry_signature: this.signature
            }).then(()=>{
                this.is_already_rated = true
                setTimeout(()=>{
                    window.close()
                }, 5000)
             })
            .catch((e)=>{
                console.error(e)
            })
            .then(()=>{
                this.$root.$emit('hide-loader')
            })
        },
        getEventInfo(event_id){
            let url = process.env.VUE_APP_API_URL+'/events?event_id='+event_id

            this.$root.$emit('show-loader')
            axios.get(url).then((res)=>{

                this.is_event_found = true

                let evt = res.data

                if(!evt){
                return alert('Could not get event details')
                }

                this.eventInfo = evt


                //start date
                if(moment().unix()<moment(evt.event_time).unix()){
                    this.is_event_started = false
                }else{
                    this.is_event_started = true
                }

                //end date
                if(moment().unix()>moment(evt.event_closes_on).unix()){
                this.is_event_ended = true
                }else{
                this.is_event_ended = false
                }

            })
            .catch((e)=>{
                console.error(e)
                this.is_event_found = false
            })
            .then(()=>{
                this.loaded = true
                this.$root.$emit('hide-loader')
            })
        },
    }
}
</script>

<style scoped>
    #rating_panel{
        color: white;
        text-align: center;
        margin-top: 50px;
    }

    .white { color: #ffffff; }

    .evt_name{
        margin-top: 30px;
    }

    .vue-star-rating{
        text-align: center;
        display: inline-block;
    }

    .rating_container{
        margin-top: 15px;
        display: block;
    }

    #thank_rating{
        margin-top: 200px;
    }

    #rating_panel .vue-star-rating
    {
        justify-content: space-around;
    }
</style>