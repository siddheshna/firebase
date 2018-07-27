$(document).ready(function(){
    manageUser.init();
    var user = firebase.auth().currentUser;

    $(document).on("click","#create-account", function(){
        $(".create-form-wrapper").show();
        $(".login-form-wrapper").hide();
    });

    $(document).on("click","#back-to-login", function(){
        $(".create-form-wrapper").hide();
        $(".login-form-wrapper").show();
    });
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $("#login-status").text("Logged In!");
        if(user.emailVerified){
            window.location = "home.html";
        }else{
            alert("Please verify Your Account from verification link sent to you.");
            manageUser.logoutUser();
        }
    } else {
        $("#login-status").text("Not Logged In!");
    }
});

var manageUser = function(){
    var login = function(){
        $(document).on("submit","#login", function(e){
            e.preventDefault();
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            loginUser(email, password);
        })
    }
    
    var loginUser = function(email, password){
        firebase.auth().signInWithEmailAndPassword(email, password).
        then(function(response) {
            $("#login").reset();
            console.log(response);
        }).catch(function(error) {
            console.log(error);
            $("#login-error").text(error.message).show();
        });
    };

    var logout = function(){
        $(document).on("click","#log-out", function(){
            logoutUser();
        });
    };

    var logoutUser = function(){
        firebase.auth().signOut().then(function(response){
            console.log(response);
        }, function(error){
            console.log(error);
        });
    };

    var createUser = function(){
        $(document).on("submit","#create-user", function(e){
            e.preventDefault();
            var email = document.getElementById("new-email").value;
            var password = document.getElementById("new-password").value;
            createUserAccount(email, password);
        })  
    };

    var createUserAccount = function(email, password){
        firebase.auth().createUserWithEmailAndPassword(email, password).
        then(function(response) {
            $("#create-user").reset();
            verifyByEmail();
        }).catch(function(error) {
            $("#create-error").text(error.message).show();
          console.log(error);
        });
    }

    var verifyByEmail = function(){
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
            console.log('Email Sent');
        }).catch(function(error) {
            console.log(error);
        });
    }

    return{
        init: function(){
            login();
            createUser();
            logout();
        },
        logoutUser: function(){
            logoutUser();
        }
    };
}();