import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBR4MgI5rO18P3B3iy8vf9Xxd18GXwqDpM";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();
    return text;
}



// Define the UI interaction handlers

const welcome_container = document.querySelector("[welcome-container]");
const user_container = document.querySelector("[user-container]");
const startBtn = document.querySelector("[start-btn]");
const messageBar = document.querySelector("[message-bar]")
const message_input = document.querySelector("[message-input]");
const sendBtn = document.querySelector("[sendBtn]");
const messageBox = document.querySelector("[message-box]");

const backbtn = document.querySelector("[back-btn]");
const darkMode_Btn = document.querySelector("[darkModeBtn]");

const audioBtn = document.querySelector("[audio-btn]");

const loader = document.querySelector(".loader");

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var Recognition = new SpeechRecognition();

audioBtn.addEventListener("click", function(){
    Recognition.start();
});

Recognition.onresult = function(e){
    console.log(e);
    var transcript = e.results[0][0].transcript;
    message_input.value = transcript;
    handleSubmit();
}



darkMode_Btn.addEventListener("click", function(){
    document.body.classList.toggle('dark');
});



backbtn.addEventListener ("click", toggleUser);

// startBtn.addEventListener("click",loginPage );
startBtn.addEventListener("click", function(){
    document.querySelector(".user-container").classList.toggle("hidden");
    startBtn.classList.toggle("hidden");
} );

document.getElementById("log-in-btn").addEventListener("click", loginPage);
document.getElementById("sign-in-btn").addEventListener("click", signinPage);






function toggleUser(){
    welcome_container.classList.toggle("hidden");
    user_container.classList.toggle("hidden");
    messageBar.classList.toggle("hidden");
}

sendBtn.addEventListener("click", function () {
    handleSubmit();
});

messageBar.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        handleSubmit(e); 
        
    }
});



// sign-in

const submit2 = document.getElementById("submit2");

submit2.addEventListener("click", function(e){
       e.preventDefault();
       const email2 = document.querySelector(".email2").value;
       const password2 = document.querySelector(".password2").value;


       signInWithEmailAndPassword(auth, email2, password2)
       .then((userCredential) => {
         // Signed up 
           const user = userCredential.user;
           
           signed();
           

         
         // ...
       })
       .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         alert(errorMessage);
         // ..
       });
   })

   async function logined(){
       toggleUser();
       loginPage();
   }

   async function signed(){
       toggleUser();
       signinPage();
   }

   


     //   cancel btn
 document.getElementById("cancel-btn").addEventListener("click", function(){
   document.getElementById("login-page").classList.toggle("hidden");
   document.getElementById("log-in").classList.toggle("hidden");

});


document.getElementById("login-page").addEventListener("click", function(){
  document.getElementById("login-page").classList.toggle("hidden");
  document.getElementById("log-in").classList.toggle("hidden");
})


   async function loginPage()
   {
       document.getElementById("login-page").classList.toggle("hidden");
       document.getElementById("log-in").classList.toggle("hidden");
   }


   document.getElementById("cancel-btn-2").addEventListener("click", function(){
       document.getElementById("sign-in-page").classList.toggle("hidden");
       document.getElementById("sign-in").classList.toggle("hidden");
   
    });
   
   
    document.getElementById("sign-in-page").addEventListener("click", function(){
      document.getElementById("sign-in-page").classList.toggle("hidden");
      document.getElementById("sign-in").classList.toggle("hidden");
    })



   async function signinPage()
   {
       document.getElementById("sign-in-page").classList.toggle("hidden");
       document.getElementById("sign-in").classList.toggle("hidden");
   }





// Define the handleSubmit function
async function handleSubmit() {

     if (message_input.value.length > 0) {
        console.log("message sent");

        
        

        let message =
            `<div chat-message class=" mb-16 relative right-[-19%] w-[76%] flex h-auto shadow-lg bg-purple-800 bg-opacity-25 backdrop-blur-sm dark:backdrop-blur-md text-blue-950 dark:text-white p-2 text-lg rounded-lg">
                <div class="flex justify-end w-full">
                    <resp class="px-2 font-sans whitespace-pre-wrap">${message_input.value}</resp>
                    <i class="fa-regular fa-keyboard p-2"></i>
                </div>
            </div>`;
        messageBox.insertAdjacentHTML("beforeend", message);
        addloader();

        const resp = await run(message_input.value);

        
        
        
        let response =
            `<div class="response-container relative mb-32 left-[5%] w-[76%] shadow-lg flex h-auto justify-between bg-blue-800 bg-opacity-25 backdrop-blur-sm dark:backdrop-blur-md text-blue-950 dark:text-white p-2 text-lg rounded-lg group">
                <i class="fa-solid fa-robot p-2"></i>
                <div id ="response-text" class="w-[95%]  whitespace-pre-wrap font-sans ">${resp}</div>
                <div class="right-3 h-6 top-2 flex gap-2 opacity-0 group-hover:opacity-100 p-2 dark:text-slate-400"> 
                    <i title="mute" class="fa-solid z-10 fa-volume-xmark mute-btn cursor-pointer hover:text-red-700 "></i>
                    <i title="copy" class="fa-regular z-10 copy-btn fa-copy cursor-pointer  hover:text-blue-800"></i>
                    
                    
            </div>
            </div>`;

            
            messageBox.insertAdjacentHTML("beforeend", response);
        
            
            removeloader();
            message_input.value = "";
            
            speech(resp);

            
            
            
            messageBox.addEventListener("click", (e) => {
                // Check if the clicked element has the "copy-btn" class
                if (e.target.classList.contains("copy-btn")) {
                    // Get the text content of the response element
                    const responseText = e.target.closest(".group").querySelector("#response-text").textContent;
            
                    // Copy the text to the clipboard
                    copyToClipboard(responseText);
                }
            
                // Check if the clicked element has the "mute-btn" class
                if (e.target.classList.contains("mute-btn")) {
                    // Cancel the current speech synthesis utterance
                    speechSynthesis.cancel();
                }
            });
            
            
           
        
    }
    
}



async function speech(words){
    const muteBtn = document.querySelector(".mute-btn");

    const speech = new SpeechSynthesisUtterance(words);
    speechSynthesis.speak(speech);
    muteBtn.addEventListener("click", async () => {
        speechSynthesis.cancel();
        // console.log("mute btn working");
    });
}

async function copyToClipboard(text) {
    // const copyBtn = document.querySelector(".copy-btn");
    await navigator.clipboard.writeText(text);
       
};


async function addloader(){
    
    loader.classList.remove("hidden");
}
async function removeloader(){
    loader.classList.add("hidden");
}

// *****************************************************************************************************************************************************

//firebase 

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBeEkJxAHfDLWMZ3TB1OBFCWNSvas2Jc_4",
    authDomain: "codebot-ai.firebaseapp.com",
    projectId: "codebot-ai",
    storageBucket: "codebot-ai.appspot.com",
    messagingSenderId: "704474884321",
    appId: "1:704474884321:web:0753628d98de61147eefa0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const submit = document.getElementById("submit");

 submit.addEventListener("click", function(e){
        e.preventDefault();
        const email = document.querySelector(".email").value;
        const password = document.querySelector(".password").value;


        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
            const user = userCredential.user;
            
            logined();
            
            

          
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
    })

    

  