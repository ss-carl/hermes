ShipStation (aka the ShipEngine platform) is releasing v1 (early alpha) of the CarrierAPI project.  
The CarrierAPI project is about defining a set of generic http requests.  
These requests are the set of actions involved in shipping a package.  

Right now these requests are roughly:  
- GetRates: Get a non-binding quote of shipping costs.
- Register: The user is trying to connect the carrier to their ShipStation account; this asks the Carrier if that is ok.
- CreateLabel: Get a shipping label.
- Track: Get tracking info about a shipment.
- RequestRefund / Void: Where applicable, indicate a paid for label won't be used and request a refund.

We're using CarrierAPI to build an integration with Hermes.  
This repo is that integration with Hermes.  
It is a deployable nodejs process that listens for CarrierAPI requests and translates them to Hermes requests.  
Then it translates the Hermes response back to a CarrierAPI response.  

So the process is:  
- Get a request from the CarrierAPI
- Validate the request can be mapped to a Hermes request
- Map the CarrierAPI request body to a Hermes request body
- Make a request to Hermes' API
- Get a response from Hermes
- Map the Hermes response to a CarrierAPI response
- Return the CarrierAPI response to ShipStation

ShipStation knows to talk to this repo's deployment because it is configured with a base URL for each Carrier integrated with the CarrierAPI.  

For the v1 release, the steps to add a Carrier to ShipStation are:
- Get access to a git repo in the ShipStation GitHub organization
- Build a process that accepts CarrierAPI requests and performs the desired action
- Commit it to the above GitHub repo
- ShipStation will review the committed code
- ShipStation will deploy the process internally
- ShipStation will add configuration to call the deployed process when a user accesses that Carrier
- ShipStation will enable access to the Carrier for users
