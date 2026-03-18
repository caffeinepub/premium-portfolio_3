import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type Submission = {
    name : Text;
    email : Text;
    message : Text;
  };

  module Submission {
    func compareByName(submission1 : Submission, submission2 : Submission) : Order.Order {
      Text.compare(submission1.name, submission2.name);
    };
  };

  let submissions = Map.empty<Text, Submission>();

  public shared ({ caller }) func submitMessage(name : Text, email : Text, message : Text) : async () {
    if (submissions.containsKey(email)) {
      Runtime.trap("You have already submitted a message!");
    };
    let newSubmission : Submission = {
      name;
      email;
      message;
    };
    submissions.add(email, newSubmission);
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.values().toArray();
  };
};
