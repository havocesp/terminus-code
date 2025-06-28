document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculatorForm');
    const errorMessages = document.getElementById('errorMessages');
    const errorList = document.getElementById('errorList');
    const resultsSection = document.getElementById('resultsSection');
    
    // Hidden input elements
    const inputX = document.getElementById('inputX');
    const inputY = document.getElementById('inputY');
    const inputZ = document.getElementById('inputZ');
    
    // Result elements
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
    
    // Neidam code elements
    const neidamToggle = document.getElementById('neidamToggle');
    const neidamTitle = document.getElementById('neidamTitle');
    const neidam1Label = document.getElementById('neidam1Label');
    const neidam2Label = document.getElementById('neidam2Label');
    const neidam3Label = document.getElementById('neidam3Label');
    const neidamProcessText = document.getElementById('neidamProcessText');
    const neidamProcessButton = document.getElementById('neidamProcessButton');
    const neidamResult = document.getElementById('neidamResult');
    const neidamResultText = document.getElementById('neidamResultText');
    const neidam1 = document.getElementById('neidam1');
    const neidam2 = document.getElementById('neidam2');
    const neidam3 = document.getElementById('neidam3');
    
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
            speechResults: 'Los resultados son: {0}, {1}, {2}',
            neidamTitle: 'Código Neidam:',
            neidamLabel1: 'Número 1:',
            neidamLabel2: 'Número 2:',
            neidamLabel3: 'Número 3:',
            neidamProcess: 'Procesar',
            neidamResultText: 'Código procesado: {0}'
        },
        en: {
            title: 'Terminus Calculator',
            instruction: 'Select variable and their symbol:',
            results: 'Results:',
            reset: 'Reset',
            listening: 'Listening...',
            voiceHelp: 'Say: "X symbol 1" or "Y symbol 3", etc.',
            speechResults: 'The results are: {0}, {1}, {2}',
            neidamTitle: 'Neidam code:',
            neidamLabel1: 'Number 1:',
            neidamLabel2: 'Number 2:',
            neidamLabel3: 'Number 3:',
            neidamProcess: 'Process',
            neidamResultText: 'Processed code: {0}'
        },
        pt: {
            title: 'Calculadora Terminus',
            instruction: 'Selecione variável e seu símbolo:',
            results: 'Resultados:',
            reset: 'Reiniciar',
            listening: 'Ouvindo...',
            voiceHelp: 'Diga: "X símbolo 1" ou "Y símbolo 3", etc.',
            speechResults: 'Os resultados são: {0}, {1}, {2}',
            neidamTitle: 'Código Neidam:',
            neidamLabel1: 'Número 1:',
            neidamLabel2: 'Número 2:',
            neidamLabel3: 'Número 3:',
            neidamProcess: 'Processar',
            neidamResultText: 'Código processado: {0}'
        },
        it: {
            title: 'Calcolatrice Terminus',
            instruction: 'Seleziona variabile e simbolo:',
            results: 'Risultati:',
            reset: 'Reimposta',
            listening: 'In ascolto...',
            voiceHelp: 'Dì: "X simbolo 1" o "Y simbolo 3", ecc.',
            speechResults: 'I risultati sono: {0}, {1}, {2}',
            neidamTitle: 'Codice Neidam:',
            neidamLabel1: 'Numero 1:',
            neidamLabel2: 'Numero 2:',
            neidamLabel3: 'Numero 3:',
            neidamProcess: 'Elabora',
            neidamResultText: 'Codice elaborato: {0}'
        },
        fr: {
            title: 'Calculateur Terminus',
            instruction: 'Sélectionnez variable et symbole:',
            results: 'Résultats:',
            reset: 'Réinitialiser',
            listening: 'Écoute...',
            voiceHelp: 'Dites: "X symbole 1" ou "Y symbole 3", etc.',
            speechResults: 'Les résultats sont: {0}, {1}, {2}',
            neidamTitle: 'Code Neidam:',
            neidamLabel1: 'Numéro 1:',
            neidamLabel2: 'Numéro 2:',
            neidamLabel3: 'Numéro 3:',
            neidamProcess: 'Traiter',
            neidamResultText: 'Code traité: {0}'
        }
    };
    
    // Variable button handlers
    variableBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            variableBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update current variable
            currentVariable = this.dataset.variable;
        });
    });
    
    // Symbol selection handlers
    symbolItems.forEach(item => {
        item.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            const symbolNumber = this.dataset.symbol;
            
            // Add selection animation
            this.classList.add('selecting');
            setTimeout(() => {
                this.classList.remove('selecting');
            }, 300);
            
            // Update the selected values
            selectedValues[currentVariable] = value;
            
            // Update the variable button to show it's been selected
            updateVariableButtonState(currentVariable, value);
            
            // Update hidden inputs
            updateHiddenInputs();
            
            // Auto-calculate if all values are selected
            if (selectedValues.X !== null && selectedValues.Y !== null && selectedValues.Z !== null) {
                calculateResults();
            }
            
            // Move to next variable automatically
            moveToNextVariable();
        });
    });
    
    function updateVariableButtonState(variable, value) {
        // Find the variable button and update its text to show the selected value
        variableBtns.forEach(btn => {
            if (btn.dataset.variable === variable) {
                btn.textContent = `${variable}: ${value}`;
                btn.classList.add('selected');
            }
        });
    }
    
    function updateHiddenInputs() {
        inputX.value = selectedValues.X || '';
        inputY.value = selectedValues.Y || '';
        inputZ.value = selectedValues.Z || '';
    }
    
    function moveToNextVariable() {
        const order = ['X', 'Y', 'Z'];
        const currentIndex = order.indexOf(currentVariable);
        
        // Find next unselected variable
        for (let i = 1; i < order.length; i++) {
            const nextIndex = (currentIndex + i) % order.length;
            const nextVar = order[nextIndex];
            
            if (selectedValues[nextVar] === null) {
                // Update active button
                variableBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.variable === nextVar) {
                        btn.classList.add('active');
                    }
                });
                currentVariable = nextVar;
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
        resultsSection.classList.add('d-none');
    }
    
    function hideError() {
        errorMessages.classList.add('d-none');
    }
    
    function showResults(results) {
        hideError();
        
        // Update result values
        result1.textContent = results.value1;
        result2.textContent = results.value2;
        result3.textContent = results.value3;
        
        // Show results section with animation
        resultsSection.classList.remove('d-none');
        
        // Add animation to result cards
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        });
        
        // Remove animation class after animation completes
        setTimeout(() => {
            resultCards.forEach(card => {
                card.classList.remove('animate');
            });
        }, 1000);
    }
    
    function calculateResults() {
        // Get form data from selected values
        const formData = {
            x: selectedValues.X,
            y: selectedValues.Y,
            z: selectedValues.Z
        };
        
        // Validate that all values are selected
        if (formData.x === null || formData.y === null || formData.z === null) {
            return;
        }
        
        // Send AJAX request
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showResults(data.results);
            } else {
                showError(data.errors || ['An error occurred']);
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
        
        // Update Neidam section
        neidamTitle.textContent = t.neidamTitle;
        neidam1Label.textContent = t.neidamLabel1;
        neidam2Label.textContent = t.neidamLabel2;
        neidam3Label.textContent = t.neidamLabel3;
        neidamProcessText.textContent = t.neidamProcess;
        
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
    
    speakButton.addEventListener('click', speakResults);
    
    // Neidam code functionality
    neidamProcessButton.addEventListener('click', function() {
        const val1 = parseInt(neidam1.value);
        const val2 = parseInt(neidam2.value);
        const val3 = parseInt(neidam3.value);
        
        // Validate inputs
        if (!val1 || !val2 || !val3 || val1 < 1 || val1 > 9 || val2 < 1 || val2 > 9 || val3 < 1 || val3 > 9) {
            neidamResult.classList.add('d-none');
            return;
        }
        
        // Simple processing (concatenate the numbers for now)
        const processedCode = `${val1}${val2}${val3}`;
        
        // Display result
        const t = translations[currentLanguage];
        neidamResultText.textContent = t.neidamResultText.replace('{0}', processedCode);
        neidamResult.classList.remove('d-none');
        
        console.log('Neidam code processed:', processedCode);
    });
    
    // Input validation for Neidam fields
    [neidam1, neidam2, neidam3].forEach(input => {
        input.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 9) this.value = 9;
            
            // Hide result when inputs change
            neidamResult.classList.add('d-none');
        });
        
        input.addEventListener('keypress', function(e) {
            // Only allow numbers 1-9
            if (e.key < '1' || e.key > '9') {
                e.preventDefault();
            }
        });
    });
    
    // Toggle arrow direction when Neidam section is expanded/collapsed
    document.getElementById('neidamCodeCollapse').addEventListener('show.bs.collapse', function() {
        neidamToggle.querySelector('span').textContent = '▼';
    });
    
    document.getElementById('neidamCodeCollapse').addEventListener('hide.bs.collapse', function() {
        neidamToggle.querySelector('span').textContent = '▶';
    });
    
    // Test speech button
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Alt+V for voice
        if (event.altKey && event.key.toLowerCase() === 'v') {
            event.preventDefault();
            voiceButton.click();
        }
        
        // Alt+S for speech
        if (event.altKey && event.key.toLowerCase() === 's') {
            event.preventDefault();
            speakButton.click();
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
