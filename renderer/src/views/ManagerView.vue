
<template>
    <div class="flex flex-col py-2 px-12 w-full">
        <h2 class="text-3xl font-bold my-6">Contact Manager</h2>
        <div class="flex">
            <form action="" class="space-y-3 w-full">
                <div class="flex flex-col space-y-3 w-full">
                    <div class="flex space-x-2 w-full mb-6">
                        <div class="border-2 border-github-gray-border text-github-gray-text flex justify-center items-center px-1 rounded-sm">To:</div>
                        <input type="email" placeholder="companyemail@bussiness.com" v-model="mailForm.to" class="w-full">
                    </div>
                    <input class="border-t-0 border-x-0 bg-github-background border-b-github-gray-border border-b-2 rounded-none focus:border-0 focus:border-b-2" type="text" placeholder="Subject" v-model="mailForm.subject">
                    <textarea name="" id="" placeholder="Type / to insert files and more" class="block border-transparent h-72 bg-github-background" v-model="mailForm.text"></textarea>
                </div>
                <button class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Send Email
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