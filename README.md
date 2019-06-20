# aLoan

My get aLaon App:

##########################################

* Clone repo
* Run npm install
* Run npm start

##########################################


- Users API
GET /users - Fetch all users

  POST /users/register - Register a new user
  {registerEmail: String, registerPassword: String}

  POST /users/login - Login User 
  {loginEmail: String, loginPassword: String}

  DELETE  /users/:userId - Delete User

  PATCH /users/apply - Apply for loan
  {userId: String, loanId: String}



- Loan API
  GET /loans - Fetch all loans

  POST /loans- Add new loan 
{name: String, description: String, interest_rate: Number, amount: Number, startDate: Date String, endDate: Date String}
