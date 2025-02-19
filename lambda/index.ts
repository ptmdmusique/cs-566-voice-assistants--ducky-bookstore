/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
import {
  ErrorHandler,
  getIntentName,
  getRequestType,
  RequestHandler,
  SkillBuilders,
} from "ask-sdk-core";
import { IntentRequest } from "ask-sdk-model";
import { Slots } from "./types";
import {
  getErrorPrompts,
  getFallbackPrompts,
  getGoodbyePrompts,
  getGreetingPrompt,
  getHelpPrompts,
  getNoResultPrompt,
  getNoSlotPrompt,
  getRepromptPrompts,
  getResultPrompts,
  getUserInputFromSlots,
  queryForData,
} from "./utils";

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput) {
    return getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(getGreetingPrompt())
      .reprompt(getRepromptPrompts())
      .getResponse();
  },
};

const SearchBooksIntentHandler: RequestHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      getIntentName(handlerInput.requestEnvelope) === "SearchBooksIntent"
    );
  },
  handle(handlerInput) {
    const slots = (handlerInput.requestEnvelope.request as IntentRequest).intent
      .slots as unknown as Slots;

    if (!slots) {
      return handlerInput.responseBuilder
        .speak(getNoSlotPrompt())
        .reprompt(getRepromptPrompts())
        .getResponse();
    }

    const userInput = getUserInputFromSlots(slots);
    const results = queryForData(userInput);

    if (results.length === 0) {
      return handlerInput.responseBuilder
        .speak(getNoResultPrompt())
        .reprompt(getRepromptPrompts())
        .getResponse();
    }

    return (
      handlerInput.responseBuilder
        .speak(getResultPrompts(results))
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};

const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(getHelpPrompts())
      .reprompt(getRepromptPrompts())
      .getResponse();
  },
};

const CancelAndStopIntentHandler: RequestHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" ||
        getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(getGoodbyePrompts())
      .getResponse();
  },
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler: RequestHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      getIntentName(handlerInput.requestEnvelope) === "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(getFallbackPrompts())
      .reprompt(getRepromptPrompts())
      .getResponse();
  },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler: RequestHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`,
    );
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  },
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler: RequestHandler = {
  canHandle(handlerInput) {
    return getRequestType(handlerInput.requestEnvelope) === "IntentRequest";
  },
  handle(handlerInput) {
    const intentName = getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler: ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(getErrorPrompts())
      .reprompt(getRepromptPrompts())
      .getResponse();
  },
};

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    SearchBooksIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent("sample/hello-world/v1.2")
  .lambda();
