import { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import translations from "../locales/translations";

export const useVoiceRecognition = (isRecording, setIsRecording, language, setInputText) => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
        useSpeechRecognition();

    useEffect(() => {
        if (!listening) {
            setIsRecording(false);
            if (transcript) {
                setInputText(transcript);
            }
        }
    }, [transcript, listening]);

    const startRecognition = () => {
        if (!browserSupportsSpeechRecognition) {
            alert(translations[language].noSupport);
            return;
        }

        resetTranscript();
        setIsRecording(true);

        SpeechRecognition.startListening({
            continuous: false,
            language: language === "ru" ? "ru-RU" : "en-US",
        });
    };
    return { startRecognition };
};