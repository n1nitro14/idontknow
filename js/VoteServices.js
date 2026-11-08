angular.module('vote-services', [])

.factory('VoteServices', function() {
  var items = new Object();
  var voteDetail;
  var choiceDetail;

  return {
    get: function() {
		  return items;
    },
    remove: function() {
		  items = new Object();
    },
    set: function(item){
      items = item;
    },
    getVoteDetail: function() {
		  return voteDetail;
    },
    setVoteDetail: function(item){
      voteDetail = item;
    },
    getChoiceDetail: function() {
		  return choiceDetail;
    },
    setChoiceDetail: function(item){
      choiceDetail = item;
    }
  };

});