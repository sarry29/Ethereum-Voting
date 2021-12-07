pragma solidity >=0.4.22 <0.7.0;

contract Election{
	// Model candidate
	struct Candidate
	{
		uint id;
		string name;
		string party;
		string gender;
		uint voteCount;
	}
	// store accounts that have voted
	mapping(address=>bool) public voters;
	// Store candidate
	// Fetch candidate
	mapping(uint => Candidate) public candidates;

	// Store candidate count
	uint public candidatesCount;
	constructor () public{
		addCandidate("Arvind Kejriwal","AAP","MALE");		 
		addCandidate("Narendra Modi","BJP","MALE");		 
		addCandidate("Soniya Gandhi","Congress","FEMALE");
	}


	function addCandidate(string memory _name,string memory _party,string memory _gender) private
	{
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount,_name,_party,_gender,0); 
	}

	function vote(uint _candidateId) public{
		// require that they haven't voted before
		require(!voters[msg.sender]);

		// require a valid candidate
		require(_candidateId > 0 && _candidateId <= candidatesCount);


		// record that voter has voted 
		voters[msg.sender] = true;

		// update candidate votecount
		candidates[_candidateId].voteCount ++;
	}
}