"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const ask_sdk_core_1 = require("ask-sdk-core");
const utils_1 = require("./utils");
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return (0, ask_sdk_core_1.getRequestType)(handlerInput.requestEnvelope) === "LaunchRequest";
    },
    handle(handlerInput) {
        const speakOutput = "Hello from Ducky. Welcome to my Bookstore, what can I get ya today?";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};
const SearchBooksIntentHandler = {
    canHandle(handlerInput) {
        return ((0, ask_sdk_core_1.getRequestType)(handlerInput.requestEnvelope) === "IntentRequest" &&
            (0, ask_sdk_core_1.getIntentName)(handlerInput.requestEnvelope) === "SearchBooksIntent");
    },
    handle(handlerInput) {
        const speakOutput = "Hello World from Ducky!";
        const slots = handlerInput.requestEnvelope.request.intent
            .slots;
        if (!slots) {
            return handlerInput.responseBuilder
                .speak("I don't think that's a question for me, let's try again!")
                .reprompt((0, utils_1.getRepromptPrompts)())
                .getResponse();
        }
        const userInput = (0, utils_1.getUserInputFromSlots)(slots);
        const results = (0, utils_1.queryForData)(userInput);
        if (results.length === 0) {
            return handlerInput.responseBuilder
                .speak((0, utils_1.getNoResultPrompt)())
                .reprompt((0, utils_1.getRepromptPrompts)())
                .getResponse();
        }
        return (handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse());
    },
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return ((0, ask_sdk_core_1.getRequestType)(handlerInput.requestEnvelope) === "IntentRequest" &&
            (0, ask_sdk_core_1.getIntentName)(handlerInput.requestEnvelope) === "AMAZON.HelpIntent");
    },
    handle(handlerInput) {
        const speakOutput = "You can say hello to me! How can I help?";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return ((0, ask_sdk_core_1.getRequestType)(handlerInput.requestEnvelope) === "IntentRequest" &&
            ((0, ask_sdk_core_1.getIntentName)(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" ||
                (0, ask_sdk_core_1.getIntentName)(handlerInput.requestEnvelope) === "AMAZON.StopIntent"));
    },
    handle(handlerInput) {
        const speakOutput = "Goodbye!";
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return ((0, ask_sdk_core_1.getRequestType)(handlerInput.requestEnvelope) === "IntentRequest" &&
            (0, ask_sdk_core_1.getIntentName)(handlerInput.requestEnvelope) === "AMAZON.FallbackIntent");
    },
    handle(handlerInput) {
        const speakOutput = "Sorry, I don't know about that. Please try again.";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return ((0, ask_sdk_core_1.getRequestType)(handlerInput.requestEnvelope) === "SessionEndedRequest");
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    },
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return (0, ask_sdk_core_1.getRequestType)(handlerInput.requestEnvelope) === "IntentRequest";
    },
    handle(handlerInput) {
        const intentName = (0, ask_sdk_core_1.getIntentName)(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;
        return (handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse());
    },
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = "Sorry, I had trouble doing what you asked. Please try again.";
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};
exports.handler = ask_sdk_core_1.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler, SearchBooksIntentHandler, HelpIntentHandler, CancelAndStopIntentHandler, FallbackIntentHandler, SessionEndedRequestHandler, IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent("sample/hello-world/v1.2")
    .lambda();
