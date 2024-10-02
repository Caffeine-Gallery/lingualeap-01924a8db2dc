import Func "mo:base/Func";

import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor {
  // Define a type for storing translation history
  type Translation = {
    original: Text;
    translated: Text;
    language: Text;
  };

  // Stable variable to store translation history
  stable var translationHistory : [Translation] = [];

  // Function to add a translation to the history
  public func addTranslation(original: Text, translated: Text, language: Text) : async () {
    let newTranslation : Translation = {
      original = original;
      translated = translated;
      language = language;
    };
    translationHistory := Array.append(translationHistory, [newTranslation]);
  };

  // Function to get the translation history
  public query func getTranslationHistory() : async [Translation] {
    translationHistory
  };

  // Function to clear the translation history
  public func clearTranslationHistory() : async () {
    translationHistory := [];
  };
}
