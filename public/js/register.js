let registerForm = document.getElementById('registration-form');

let firstName = document.getElementById('firstNameInput');
let lastName = document.getElementById('lastNameInput');
let emailAddress = document.getElementById('emailAddressInput');
let password = document.getElementById('passwordInput');
//let homeaddress = document.getElementById('homeaddressInput')
let mobile = document.getElementById('mobileInput')
let confirmPassword = document.getElementById('confirmPasswordInput');
let errorDiv = document.getElementById('error-div');
let serverErrors = document.getElementById('server-errors');

const validNumber = (num, varName, isInteger, rangeLow, rangeHigh) => {
	/* 
  Validates a number and returns it.

  num = Variable
  varName = String (variable name)
  isInteger = Boolean
  rangeLow = Number
  rangeHigh = Number

  Returns Number
  */
	let numName = varName || "Number variable";
	if (num === undefined) throw `Error: ${numName} not provided`;
	if (
		typeof num !== "number" ||
		isNaN(num) ||
		num == Infinity ||
		num == -Infinity
	)
		throw `${numName} must be a real number`;
	if (isInteger && Math.floor(num) != num)
		throw `${numName} must be a whole number`;
	if (rangeLow !== undefined) {
		if (num < rangeLow)
			throw `${numName} must be greater than ${rangeLow} to make an account`;
	}
	if (rangeHigh !== undefined) {
		if (num > rangeHigh)
			throw `${numName} must be less than ${rangeHigh}.`;
	}
	return num;
};

const validState = (state) => {
	/*
	Validates a 2 letter state abbreviation and returns it trimmed.
	*/
	state = validStr(state, "State"); 	//check and trim string
	if (state.length != 2) {
		throw `Error: State must be its 2 letter abbreviation.`
	}
	state = state.toUpperCase();

	let states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
				'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
	if (!states.includes(state)) {
		throw `Error: State must be valid state.`
	}
	return state;
};

const validZip = (zip) => {
  /*
  Verifies that a given U.S. zip code is valid
  */
  validStr(zip);
  zip = zip.trim();
  let isValid = /^\d{5}(?:[-\s]\d{4})?$/.test(zip);
  if (!isValid) {
    throw "Error: Invalid US Zip Code";
  }
  return zip;
};

const validStr = (str, varName) => {
	let strName = varName || "String variable";
	if (!str) throw `Error: ${strName} not provided`;
	if (typeof str !== "string" || str.trim().length === 0)
		throw `Error: ${strName} must be a non-empty string.`;
	str = str.trim();
	return str;
};

const checkName = (name, stringName) => {
    name = validStr(name, "Name");
    if (!/^[a-zA-Z]+/.test(name)) {
        throw `Error: ${stringName} cannot contain any spaces or numbers`
    }
    if (name.length < 2 || name.length > 25) {
        throw `Error: ${stringName} cannot be less than 2 or greater than 25 characters`;
    }
    return name;
}

const validEmail = (email) => {
    validStr(email);
    email = email.trim();
    let isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      throw "Error: Invalid email address";
    }
    return email;
}

const checkPassword = (password) => {
    password = validStr(password, "Password");
  
    if (password.split(" ").length > 1) {
        throw `Error: Password cannot contain spaces`;
    }
    if (password.length < 8) {
        throw `Error: Password length must be at least 8`;
    }
    if (!/[A-Z]/.test(password)) {
        throw `Error: Password must contain at least one uppercase character`;
    }
    if (!/\d/.test(password)) {
        throw `Error: Password must contain at least one number`;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw `Error: Password must contain at least one special character`;
    }
    return password;
  }

/*const validGender = (gender) => {
    if (gender.toLowerCase().trim() != "male" && gender.toLowerCase().trim() != "female" && gender.toLowerCase().trim() != "transgender" && gender.toLowerCase().trim() != "non-binary") {
        throw 'Invalid gender';
    }
}*/

const validUsername = (username) => {
    username = validStr(username, "Username");
    if (username.length < 10) {
      throw 'Username must be at least 10 characters'
    }
    return username;
};

const validEmailOptional = (email) => {
    if(typeof email !== "string" || email.trim()!== ""){
      return validEmail(email)
    }
    else{
      return email
    }
  }
  
  const validStrOptional = (str, name) => {
    if(typeof str !== "string" || str.trim()!== ""){
      return validEmail(str, name)
    }
    else{
      return str
    }
  }
  
  const validMobile = (mobile) => {
    let validMobile;
    try {
      validMobile = validStr(mobile, "Phone number")
    } catch (e) {
      throw e
    }
    if(isNaN(validMobile)){
      throw "Error: Not a valid phone number (non-numerical string)"
    }
    return validMobile
  }

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {   
    serverErrors.hidden = true;

    errorDiv.hidden = false;
    errorDiv.innerHTML = "";
    let emptyFirst = false;
    let emptyLast = false;
    let emptyEmail = false;
    let emptyMobile = false;
    let emptyPassword = false;
    let emptyConfirmPassword = false;
    let goodPass = false;
    let goodConfirmPass = false;

    //check first name
    if (firstName.value.trim() === "") {
        event.preventDefault();
        emptyFirst = true;
        let message = document.createElement('p');
        message.innerHTML = "First name is required"
        errorDiv.appendChild(message);
    }
    if (!emptyFirst) {
        try {
            firstName.value = checkName(firstName.value, "First name");
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "First name is not valid"
            console.log(e)
            errorDiv.appendChild(message);
        }
    }

    //check last name
    if (lastName.value.trim() === "") {
        event.preventDefault();
        emptyLast = true;
        let message = document.createElement('p');
        message.innerHTML = "Last name is required"
        errorDiv.appendChild(message);
    }
    if (!emptyLast) {
        try {
            lastName.value = checkName(lastName.value, "Last name");
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Last name is not valid"
            errorDiv.appendChild(message);        
        }
    }

    //check phone
    if (mobile.value.trim() === "") {
        event.preventDefault();
        emptyMobile = true;
        let message = document.createElement('p');
        message.innerHTML = "Phone Number is required"
        errorDiv.appendChild(message);
    }
    if (!emptyMobile) {
        try {
            mobile.value = validMobile(mobile.value);
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Phone number is not valid"
            errorDiv.appendChild(message);        
        }
    }
     //check email
     if (emailAddress.value.trim() === "") {
        //event.preventDefault();
        emptyEmail = true;
        /*let message = document.createElement('p');
        message.innerHTML = "Email is required"
        errorDiv.appendChild(message);*/
    }
    if (!emptyEmail) {
        try {
            emailAddress.value = validEmail(emailAddress.value);
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Email is not valid"
            errorDiv.appendChild(message);        
        }
    }

    // if (!emptyLevel) {
    //     try {
    //         level.value = validLevel(level.value);
    //     }
    //     catch (e) {
    //         event.preventDefault();
    //         let message = document.createElement('p');
    //         message.innerHTML = "Level is not valid"
    //         errorDiv.appendChild(message);        
    //     }
    // }

    // check password
    if (password.value.trim() === "") {
        event.preventDefault();
        emptyPassword = true;
        let message = document.createElement('p');
        message.innerHTML = "Password is required"
        errorDiv.appendChild(message);
    }
    if (!emptyPassword) {
        try {
            password.value = checkPassword(password.value);
            goodPass = true;
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Password is not valid"
            errorDiv.appendChild(message);        
        }
    }

    //check confirm password
    if (confirmPassword.value.trim() === "") {
        event.preventDefault();
        emptyConfirmPassword = true;
        let message = document.createElement('p');
        message.innerHTML = "Confirm password is required"
        errorDiv.appendChild(message);
    }
    if (!emptyConfirmPassword) {
        try {
            confirmPassword.value = checkPassword(confirmPassword.value);
            goodConfirmPass = true;
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Confirm password is not valid"
            errorDiv.appendChild(message);        
        }
    }

    //check if passwords match
    if (!emptyPassword && !emptyConfirmPassword && goodPass && goodConfirmPass) {
        if (password.value !== confirmPassword.value) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Password and confirm password do not match"
            errorDiv.appendChild(message);  
        }
    }
  });
}