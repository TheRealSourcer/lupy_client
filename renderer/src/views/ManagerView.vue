
<template>
    <div class="flex flex-col py-2 px-4">
    <h2 class="text-3xl font-bold mb-4">Contact Manager</h2>
    <div class="flex">
        <form action="" class="space-y-3">
            <div class="flex flex-col space-y-3">
                <div class="space-x-2">
                    <label for="">From Bussiness Email:</label>
                    <input type="email" placeholder="theiremail@bussiness.com" v-model="mailForm.to">
                </div>
                <div class="space-x-2">
                    <label for="">To Bussiness Email:</label> <input type="email" placeholder="youremail@bussiness.com" v-model="mailForm.from">
                </div>
                <input type="text" placeholder="Subject" v-model="mailForm.subject">
                <textarea name="" id="" placeholder="body" class="block" v-model="mailForm.text"></textarea>
            </div>
            <button class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Send
            </button>
        </form>
    </div>
    </div>
</template>


<script setup>

import { ref, reactive } from "vue"
// import nodemailer from "node_modules/n"

// const transporter = nodemailer.createTransport({
//     service: 'gmail', // or another service
//     auth: {
//         user: process.env.EMAIL_USER, // your email address
//         pass: process.env.EMAIL_PASS  // your email password
//     }
// });

const mailForm = reactive({
    from: "",
    to: "",
    subject: "",
    text: "",
    html: "",
})

// const sendEmail = ()=> {
//     transporter.sendEmail(mailForm);
// }

</script>