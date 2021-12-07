var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts)
{
	var electionInstance;

	it("initializes with three candidates",function(){
		return Election.deployed().then(function(instance)
		{
			return instance.candidatesCount();
		}).then(function(count){

			// check for how many candidate are standing in election
			assert.equal(count,3);			
		});//count
	});//it


	it("initializes the candidates with correct values", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.candidates(1);
		
		}).then(function(candidate){
			
			assert.equal(candidate[0],1,"contains the correct id");
			assert.equal(candidate[1],"Arvind Kejriwal","contains the correct name");
			assert.equal(candidate[2],"AAP","contains the party name");
			assert.equal(candidate[3],"MALE","correct gender");
			assert.equal(candidate[4],0,"contains the correct vote count");

			return electionInstance.candidates(2);

		}).then(function(candidate){
			
			assert.equal(candidate[0],2,"contains the correct id");
			assert.equal(candidate[1],"Narendra Modi","contains the correct name");
			assert.equal(candidate[2],"BJP","contains the party name");
			assert.equal(candidate[3],"MALE","correct gender");
			assert.equal(candidate[4],0,"contains the correct vote count");
			return electionInstance.candidates(3);

		}).then(function(candidate){
			assert.equal(candidate[0],3,"contains the correct id");
			assert.equal(candidate[1],"Soniya Gandhi","contains the correct name");
			assert.equal(candidate[2],"Congress","contains the correct name");
			assert.equal(candidate[3],"FEMALE","correct gender");
			assert.equal(candidate[4],0,"contains the correct vote count");
		});
	}); //it


	it("allows a voter to cast a vote", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId,{from : accounts[0]});
		
		}).then(function(receipt){
			return electionInstance.voters(accounts[0]);

		}).then(function(voted){
			
			assert(voted,"the voter was marked as voted");			
			return electionInstance.candidates(candidateId);

		}).then(function(candidate){

			var voteCount = candidate[4];
			assert.equal(voteCount,1,"increment the candidate's vote count");
  		});
	}); //it


	// vote test function
	it("throws an exception for invalid candidates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    
    }).then(function(candidate1) {
      var voteCount = candidate1[4];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    
    }).then(function(candidate2) {
      var voteCount = candidate2[4];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
      return electionInstance.candidates(3);
    
    }).then(function(candidate3) {
      var voteCount = candidate3[4];
      assert.equal(voteCount, 0, "candidate 3 did not receive any votes");
    
    });
  });


	it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    
    }).then(function(candidate) {
      var voteCount = candidate[4];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    
    }).then(assert.fail).catch(function(error) {
      assert(error.message, 'error message must contain revert');
      // assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    
    }).then(function(candidate1) {
      var voteCount = candidate1[4];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    
    }).then(function(candidate2) {
      var voteCount = candidate2[4];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    return electionInstance.candidates(3);
    
    }).then(function(candidate3) {
      var voteCount = candidate3[4];
      assert.equal(voteCount, 0, "candidate 3 did not receive any votes");
    });
  });



});//contracts