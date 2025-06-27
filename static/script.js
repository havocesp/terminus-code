document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculatorForm = document.getElementById('calculatorForm');
    const inputX = document.getElementById('inputX');
    const inputY = document.getElementById('inputY');
    const inputZ = document.getElementById('inputZ');
    const errorMessages = document.getElementById('errorMessages');
    const errorList = document.getElementById('errorList');
    const resultsSection = document.getElementById('resultsSection');
    const result1 = document.getElementById('result1');
    const result2 = document.getElementById('result2');
    const result3 = document.getElementById('result3');
    
    // Symbol selection elements
    const symbolItems = document.querySelectorAll('.symbol-item');
    const variableBtns = document.querySelectorAll('.variable-btn');
    const resetButton = document.getElementById('resetButton');
    
    // Language and voice elements
    const flagIcons = document.querySelectorAll('.flag-icon');
    const voiceButton = document.getElementById('voiceButton');
    const speakButton = document.getElementById('speakButton');
    const testSpeechButton = document.getElementById('testSpeechButton');
    const voiceStatus = document.getElementById('voiceStatus');
    const voiceStatusText = document.getElementById('voiceStatusText');
    
    // Text elements for translation
    const mainTitle = document.getElementById('mainTitle');
    const instructionText = document.getElementById('instructionText');
    const resultsTitle = document.getElementById('resultsTitle');
    
    // Current state
    let currentVariable = 'X';
    let selectedValues = { X: null, Y: null, Z: null };
    let currentLanguage = 'es';
    let recognition = null;
    let isListening = false;
    
    // Language translations
    const translations = {
        es: {
            title: 'Calculadora Terminus',
            instruction: 'Selecciona variable y su símbolo:',
            results: 'Resultados:',
            reset: 'Reiniciar',
            listening: 'Escuchando...',
            voiceHelp: 'Di: "X símbolo 1" o "Y símbolo 3", etc.',
            speechResults: 'Los resultados son: {0}, {1}, {2}'
        },
        en: {
            title: 'Terminus Calculator',
            instruction: 'Select variable and their symbol:',
            results: 'Results:',
            reset: 'Reset',
            listening: 'Listening...',
            voiceHelp: 'Say: "X symbol 1" or "Y symbol 3", etc.',
            speechResults: 'The results are: {0}, {1}, {2}'
        },
        pt: {
            title: 'Calculadora Terminus',
            instruction: 'Selecione variável e seu símbolo:',
            results: 'Resultados:',
            reset: 'Reiniciar',
            listening: 'Ouvindo...',
            voiceHelp: 'Diga: "X símbolo 1" ou "Y símbolo 3", etc.',
            speechResults: 'Os resultados são: {0}, {1}, {2}'
        },
        it: {
            title: 'Calcolatrice Terminus',
            instruction: 'Seleziona variabile e simbolo:',
            results: 'Risultati:',
            reset: 'Reimposta',
            listening: 'In ascolto...',
            voiceHelp: 'Dì: "X simbolo 1" o "Y simbolo 3", ecc.',
            speechResults: 'I risultati sono: {0}, {1}, {2}'
        },
        fr: {
            title: 'Calculateur Terminus',
            instruction: 'Sélectionnez variable et symbole:',
            results: 'Résultats:',
            reset: 'Réinitialiser',
            listening: 'Écoute...',
            voiceHelp: 'Dites: "X symbole 1" ou "Y symbole 3", etc.',
            speechResults: 'Les résultats sont: {0}, {1}, {2}'
        }
    };
    
    // Variable button functionality
    variableBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentVariable = this.dataset.variable;
            updateVariableButtonState(currentVariable, selectedValues[currentVariable]);
            updateHiddenInputs();
        });
    });
    
    // Symbol selection functionality
    symbolItems.forEach(item => {
        item.addEventListener('click', function() {
            if (currentVariable) {
                const value = parseInt(this.dataset.value);
                
                // Add visual feedback
                this.classList.add('selecting');
                setTimeout(() => this.classList.remove('selecting'), 300);
                
                // Update selected values
                selectedValues[currentVariable] = value;
                
                // Update variable button to show selected symbol
                updateVariableButtonState(currentVariable, value);
                
                // Update hidden inputs
                updateHiddenInputs();
                
                // Move to next variable if current one is set
                moveToNextVariable();
                
                // Calculate results if all variables are set
                if (selectedValues.X !== null && selectedValues.Y !== null && selectedValues.Z !== null) {
                    calculateResults();
                }
            }
        });
    });
    
    function updateVariableButtonState(variable, value) {
        const btn = document.querySelector(`[data-variable="${variable}"]`);
        if (btn) {
            // Reset all buttons
            variableBtns.forEach(b => {
                b.classList.remove('active');
                if (selectedValues[b.dataset.variable] !== null) {
                    b.classList.add('selected');
                    b.textContent = `${b.dataset.variable}: ${selectedValues[b.dataset.variable]}`;
                } else {
                    b.classList.remove('selected');
                    b.textContent = b.dataset.variable;
                }
            });
            
            // Set current as active
            btn.classList.add('active');
        }
    }
    
    function updateHiddenInputs() {
        inputX.value = selectedValues.X || '';
        inputY.value = selectedValues.Y || '';
        inputZ.value = selectedValues.Z || '';
    }
    
    function moveToNextVariable() {
        const variables = ['X', 'Y', 'Z'];
        const currentIndex = variables.indexOf(currentVariable);
        
        // Find next unset variable
        for (let i = 1; i < variables.length; i++) {
            const nextIndex = (currentIndex + i) % variables.length;
            const nextVariable = variables[nextIndex];
            if (selectedValues[nextVariable] === null) {
                currentVariable = nextVariable;
                updateVariableButtonState(currentVariable, selectedValues[currentVariable]);
                return;
            }
        }
    }
    
    function showError(messages) {
        errorList.innerHTML = '';
        messages.forEach(message => {
            const li = document.createElement('li');
            li.textContent = message;
            errorList.appendChild(li);
        });
        errorMessages.classList.remove('d-none');
    }
    
    function hideError() {
        errorMessages.classList.add('d-none');
    }
    
    function showResults(results) {
        result1.textContent = results.value1;
        result2.textContent = results.value2;
        result3.textContent = results.value3;
        resultsSection.classList.remove('d-none');
        hideError();
    }
    
    function calculateResults() {
        const data = {
            x: selectedValues.X,
            y: selectedValues.Y,
            z: selectedValues.Z
        };
        
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showResults(data.results);
            } else {
                showError([data.error || 'Calculation error occurred']);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError(['Network error: Please check your connection and try again']);
        });
    }
    
    // Reset button handler
    resetButton.addEventListener('click', function() {
        // Reset selected values
        selectedValues = { X: null, Y: null, Z: null };
        currentVariable = 'X';
        
        // Reset variable buttons
        variableBtns.forEach(btn => {
            btn.classList.remove('selected');
            btn.textContent = btn.dataset.variable;
            if (btn.dataset.variable === 'X') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Reset hidden inputs
        inputX.value = '';
        inputY.value = '';
        inputZ.value = '';
        
        // Hide results and errors
        resultsSection.classList.add('d-none');
        hideError();
        
        // Reset result values
        result1.textContent = '-';
        result2.textContent = '-';
        result3.textContent = '-';
    });
    
    // Language switching
    flagIcons.forEach(flag => {
        flag.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });
    
    function switchLanguage(lang) {
        currentLanguage = lang;
        
        // Update active flag
        flagIcons.forEach(flag => {
            flag.classList.toggle('active', flag.dataset.lang === lang);
        });
        
        // Update text content
        const t = translations[lang];
        mainTitle.textContent = t.title;
        instructionText.textContent = t.instruction;
        resultsTitle.textContent = t.results;
        resetButton.textContent = t.reset;
        voiceStatusText.textContent = t.listening;
        
        // Update button titles
        voiceButton.title = t.voiceHelp + ' (Alt+V)';
        speakButton.title = 'Leer resultados (Alt+S)';
    }
    
    // Voice recognition setup
    function initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = getVoiceLanguage(currentLanguage);
            
            recognition.onstart = function() {
                isListening = true;
                voiceStatus.classList.remove('d-none');
                voiceButton.classList.add('btn-danger');
                voiceButton.classList.remove('btn-outline-light');
                console.log('Voice recognition started');
            };
            
            recognition.onend = function() {
                isListening = false;
                voiceStatus.classList.add('d-none');
                voiceButton.classList.remove('btn-danger');
                voiceButton.classList.add('btn-outline-light');
                console.log('Voice recognition ended');
            };
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript.toLowerCase();
                console.log('Voice command received:', transcript);
                processVoiceCommand(transcript);
            };
            
            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                isListening = false;
                voiceStatus.classList.add('d-none');
                voiceButton.classList.remove('btn-danger');
                voiceButton.classList.add('btn-outline-light');
                
                // Show user-friendly error message
                if (event.error === 'network') {
                    console.log('Voice recognition requires internet connection');
                } else if (event.error === 'not-allowed') {
                    console.log('Microphone access denied. Please allow microphone access.');
                }
            };
        } else {
            console.log('Speech recognition not supported in this browser');
        }
    }
    
    function getVoiceLanguage(lang) {
        const voiceLangs = {
            'es': 'es-ES',
            'en': 'en-US',
            'pt': 'pt-PT',
            'it': 'it-IT',
            'fr': 'fr-FR'
        };
        return voiceLangs[lang] || 'es-ES';
    }
    
    function processVoiceCommand(transcript) {
        // Parse commands like "X symbol 1", "Y símbolo 3", etc.
        const patterns = [
            /([xyz])\s*(?:symbol|símbolo|symbole|simbolo)\s*([1-6])/i,
            /([xyz])\s*([1-6])/i,
            /(reset|reiniciar|réinitialiser|reimposta)/i
        ];
        
        for (let pattern of patterns) {
            const match = transcript.match(pattern);
            if (match) {
                if (match[1] && match[2]) {
                    // Variable and symbol selection
                    const variable = match[1].toUpperCase();
                    const symbolNum = parseInt(match[2]);
                    
                    // Set current variable
                    currentVariable = variable;
                    updateActiveVariableButton(variable);
                    
                    // Simulate symbol click
                    const symbolItem = document.querySelector(`[data-symbol="${symbolNum}"]`);
                    if (symbolItem) {
                        symbolItem.click();
                    }
                } else if (match[0]) {
                    // Reset command
                    resetButton.click();
                }
                break;
            }
        }
    }
    
    function updateActiveVariableButton(variable) {
        variableBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.variable === variable) {
                btn.classList.add('active');
            }
        });
    }
    
    // Audio notification
    function playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }

    // Text-to-speech
    function speakResults() {
        if ('speechSynthesis' in window) {
            const r1 = result1.textContent;
            const r2 = result2.textContent;
            const r3 = result3.textContent;
            
            if (r1 !== '-' && r2 !== '-' && r3 !== '-') {
                // Stop any current speech
                speechSynthesis.cancel();
                
                const text = translations[currentLanguage].speechResults
                    .replace('{0}', r1)
                    .replace('{1}', r2)
                    .replace('{2}', r3);
                
                console.log('Preparing to speak:', text);
                
                // Wait for voices to be loaded
                function speakWhenReady() {
                    const voices = speechSynthesis.getVoices();
                    if (voices.length === 0) {
                        setTimeout(speakWhenReady, 100);
                        return;
                    }
                    
                    const utterance = new SpeechSynthesisUtterance(text);
                    const langCode = getVoiceLanguage(currentLanguage);
                    
                    // Find appropriate voice
                    const voice = voices.find(v => v.lang.startsWith(langCode.substring(0, 2))) || voices[0];
                    if (voice) {
                        utterance.voice = voice;
                    }
                    
                    utterance.lang = langCode;
                    utterance.rate = 0.8;
                    utterance.volume = 0.9;
                    utterance.pitch = 1;
                    
                    utterance.onstart = () => console.log('Speech started');
                    utterance.onend = () => console.log('Speech ended');
                    utterance.onerror = (e) => console.error('Speech error:', e);
                    
                    speechSynthesis.speak(utterance);
                    console.log('Speech initiated with voice:', voice ? voice.name : 'default');
                }
                
                speakWhenReady();
            }
        } else {
            console.log('Speech synthesis not supported');
        }
    }
    
    // Voice button handlers
    if (voiceButton) {
        voiceButton.addEventListener('click', function() {
            if (recognition) {
                if (isListening) {
                    recognition.stop();
                } else {
                    recognition.lang = getVoiceLanguage(currentLanguage);
                    recognition.start();
                }
            }
        });
    }
    
    if (speakButton) {
        speakButton.addEventListener('click', speakResults);
    }
    
    // Test speech button
    if (testSpeechButton) {
        testSpeechButton.addEventListener('click', function() {
            const testMessage = currentLanguage === 'es' ? 'Probando texto a voz' : 
                               currentLanguage === 'en' ? 'Testing text to speech' :
                               currentLanguage === 'pt' ? 'Testando texto para fala' :
                               currentLanguage === 'it' ? 'Test da testo a voce' :
                               'Test de synthèse vocale';
            
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(testMessage);
                utterance.lang = getVoiceLanguage(currentLanguage);
                utterance.rate = 0.8;
                utterance.volume = 0.9;
                speechSynthesis.speak(utterance);
                console.log('Test speech:', testMessage);
            } else {
                console.log('Speech synthesis not available');
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Alt+V for voice
        if (event.altKey && event.key.toLowerCase() === 'v') {
            event.preventDefault();
            if (voiceButton) voiceButton.click();
        }
        
        // Alt+S for speech
        if (event.altKey && event.key.toLowerCase() === 's') {
            event.preventDefault();
            if (speakButton) speakButton.click();
        }
        
        // Alt+R for reset
        if (event.altKey && event.key.toLowerCase() === 'r') {
            event.preventDefault();
            resetButton.click();
        }
        
        // Number keys 1-3 for variables
        if (event.key >= '1' && event.key <= '3') {
            const variables = ['X', 'Y', 'Z'];
            const variable = variables[parseInt(event.key) - 1];
            currentVariable = variable;
            updateActiveVariableButton(variable);
        }
        
        // Number keys 4-9 for symbols
        if (event.key >= '4' && event.key <= '9') {
            const symbolNum = parseInt(event.key) - 3;
            if (symbolNum <= 6) {
                const symbolItem = document.querySelector(`[data-symbol="${symbolNum}"]`);
                if (symbolItem) {
                    symbolItem.click();
                }
            }
        }
    });
    
    // Add keyboard event listeners to symbol items
    symbolItems.forEach(item => {
        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
    
    // Initialize voice recognition
    initVoiceRecognition();
    
    // Auto-speak results when they change
    const originalShowResults = showResults;
    showResults = function(results) {
        originalShowResults(results);
        
        // Play notification sound
        playNotificationSound();
        
        // Speak results after a short delay
        setTimeout(() => {
            console.log('Attempting to speak results');
            speakResults();
        }, 1000);
    };
    
    // Load voices when available
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = function() {
            console.log('Voices loaded:', speechSynthesis.getVoices().length);
        };
    }
});