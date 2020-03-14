# Development
To set up your development environment you must do the following

 1. Run npm install to locally install all the correct packages
 2. See the  [Database-Setup Section](#Database-Setup)
 3. Navigate to the root project directory (the directory with server.js)
 4. Run npm start to build and run both the client and the server
 
 Currently the project has been set up to run the client through a webpack development server that sends the bundle.js to the client through port 3000. At the same time any API request to the server is proxy'd through the webpack development server to the server side application running on port 3003. Any changes to the client side or server side code with refresh that section of the app upon file save.

## Creating a New Endpoint
When creating a new end point on the server follow the convention of `"/api/endPointName"`. On the client side a request can then be made through [axios](https://www.npmjs.com/package/axios). An example of accessing an endpoint from the client is provided below:
Server Side Node:
```
....
app.get('/api/endPoint', (req, res) => {
    res.json({result:  "Some Server Data"});
});
....
```

Client Side JS:
```
import axios from "axios" 

...

try {
    const response = await axios.get('/api/endPoint');
    console.log(response.data.result);
} catch(error) {
    console.error("Server error: " + error)
}

....
```
## Using High Order Components in React
High order components (HOC) are components that use a have-a relationship to combine multiple components together into a new component. The react [documentation](https://reactjs.org/docs/higher-order-components.html) provides a solid explanation and example. We will be using high order components to avoid duplicating logic needed on multiple pages, such as authentication redirection, or error alerts. Below is an example of a simple HOC and how to use it.

The HOC Component:
```
export  const  example = (WrappedComponent) => {
	class  Example  extends  Component {
		state = { demo: '' }

		render() {
			return (
				<div>
					<Alert  theme={this.state.theme}  dismissible={this.dismiss}  open={this.state.visible}>
						{this.state.message}
					</Alert>
					<WrappedComponent  showAlert={this.showAlert}  {...this.props}/>
				</div>
			);
		}

	    dismiss = () => this.setState({visible:  false});
    }
	
    return  WithAlert;
};


```

Combing the HOC with another component.

```
//In AnotherComponent.js
....
import example from './ExampleHOC.js'
class AnotherComponent extends Component {
	....
}

//using this component will now have the functionality in example and in AnotherComponent combined into a single new component.
export default example(AnotherCompontent);
```
 
 To see an example of this in use look at components/ComponentWithAlert.js and Home.js

# Database Setup
To set up the database to be used in on a local machine for development we need to first created the database in MySQL and then populate the .env configuration file.
## Creating the MySQL Database
First install MySQL. See this link on how to install it depending on your [OS](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/).  Once MySQL is installed and setup do the following to create the database.

 1. Run `mysql -u root - p` and then enter the root users password
 2. Run CREATE DATABASE StudyHelper
 3. Hit Ctrl-D to exit the command line tool

After this the database should be created and ready to use.
## Creating and Populating the .env File
The .env file is where our configuration information is kept. This gets loaded into the process.env enviroment variable for node when the server starts up. Add the following entries to allow the mysql package to connect to the database you set up previously.

 - DB_HOST=localhost
 - DB_USER=root
 - DB_PASS=__root_password__
 - DB_NAME=StudyHelper

Replace the __root_password__ with the password for that MySQL user, in this case the password you entered when logging MySQL through the command line.

Once these items have been added the mysql node package should be able to connect to your local database.

## Troubleshooting Database Connection Errors

 1. __ER_NOT_SUPPORTED_AUTH_MODE:__ : If you're getting this error after following the steps above run the following commands to address this issue. 
	 1. Run the mysql command line tool again and login as root
	 2. Run this command `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '__password__'` Where __password\_\_ is the password you used for root.
	 3. Then run ``flush privileges;``

	More information regarding this error can be found [here](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server/53382070).

# Deploying on Google App Engine
We are using Google App Engine (GAE) and Cloud SQL to deploy our application. To deploy the application to GAE the following steps need to be done first.

 1. Create a Cloud SQL Instance by following the [quickstart](https://cloud.google.com/sql/docs/mysql/quickstart) guide step 1 and 2.
 3. Once connected to the Cloud SQL database run CREATE DATABASE StudyHelper
 4. Create a user with a password and username of your choice in the cloud SQL console
 5. After setting up the database go to App Engine and create a new App Engine instance. Select NodeJs as the runtime and Flexible environment.
 6. Open the google cloud console and clone the repo locally into the App Engine instance
 7. Run `npm run prod` to install the required packages and build the static react files
 8. Go to the Cloud SQL dashboard and copy the connection string and past it into the **INSTANCE_CONNECTION_NAME** location in the app.yaml file
 9. Upload a .env file that uses the same credentials that you created for your Cloud SQL user and add DB_SOCKET_PATH=/cloudsql/**INSTANCE_CONNECTION_NAME** using the cloud console and run `mv .env ./social-study-helper` in the console to move the environment file into the project folder
 10. Run gcloud app deploy