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
    
    // Language elements
    const flagIcons = document.querySelectorAll('.flag-icon');
    
    // Text elements for translation
    const mainTitle = document.getElementById('mainTitle');
    const instructionText = document.getElementById('instructionText');
    const resultsTitle = document.getElementById('resultsTitle');
    
    // Nathan code elements
    const nathanTitle = document.getElementById('nathanTitle');
    const nathan1Label = document.getElementById('nathan1Label');
    const nathan2Label = document.getElementById('nathan2Label');
    const nathan3Label = document.getElementById('nathan3Label');
    const nathanResult = document.getElementById('nathanResult');
    const nathanResultText = document.getElementById('nathanResultText');
    const nathan1 = document.getElementById('nathan1');
    const nathan2 = document.getElementById('nathan2');
    const nathan3 = document.getElementById('nathan3');
    
    // Current state
    let currentVariable = 'X';
    let selectedValues = { X: null, Y: null, Z: null };
    let currentLanguage = 'es';
    
    // Language translations
    const translations = {
        es: {
            title: 'Calculadora Terminus',
            instruction: 'Selecciona variable y su símbolo:',
            results: 'Resultados:',
            reset: 'Reiniciar',
            nathanTitle: 'Código Nathan:',
            nathanLabel1: 'Hora del reloj:',
            nathanLabel2: 'Tarjeta cantina:',
            nathanLabel3: 'Panel pared:',

            nathanResultText: 'Código procesado: {0}'
        },
        en: {
            title: 'Terminus Calculator',
            instruction: 'Select variable and their symbol:',
            results: 'Results:',
            reset: 'Reset',
            nathanTitle: 'Nathan code:',
            nathanLabel1: 'Clock hour:',
            nathanLabel2: 'Canteen card:',
            nathanLabel3: 'Wall panel:',

            nathanResultText: 'Processed code: {0}'
        },
        pt: {
            title: 'Calculadora Terminus',
            instruction: 'Selecione variável e seu símbolo:',
            results: 'Resultados:',
            reset: 'Reiniciar',
            nathanTitle: 'Código Nathan:',
            nathanLabel1: 'Hora do relógio:',
            nathanLabel2: 'Cartão cantina:',
            nathanLabel3: 'Painel parede:',

            nathanResultText: 'Código processado: {0}'
        },
        it: {
            title: 'Calcolatrice Terminus',
            instruction: 'Seleziona variabile e simbolo:',
            results: 'Risultati:',
            reset: 'Reimposta',
            nathanTitle: 'Codice Nathan:',
            nathanLabel1: 'Ora orologio:',
            nathanLabel2: 'Carta mensa:',
            nathanLabel3: 'Pannello parete:',

            nathanResultText: 'Codice elaborato: {0}'
        },
        fr: {
            title: 'Calculateur Terminus',
            instruction: 'Sélectionnez variable et symbole:',
            results: 'Résultats:',
            reset: 'Réinitialiser',
            nathanTitle: 'Code Nathan:',
            nathanLabel1: 'Heure horloge:',
            nathanLabel2: 'Carte cantine:',
            nathanLabel3: 'Panneau mur:',

            nathanResultText: 'Code traité: {0}'
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
        
        // Update Nathan section
        nathanTitle.textContent = t.nathanTitle;
        nathan1Label.textContent = t.nathanLabel1;
        nathan2Label.textContent = t.nathanLabel2;
        nathan3Label.textContent = t.nathanLabel3;
    }
    
    // Nathan code functionality - auto-process when all inputs are filled
    function processNathanCode() {
        const val1 = parseInt(nathan1.value);
        const val2 = parseInt(nathan2.value);
        const val3 = parseInt(nathan3.value);
        
        // Validate inputs
        if (!val1 || !val2 || !val3 || val1 < 1 || val1 > 9 || val2 < 1 || val2 > 9 || val3 < 1 || val3 > 9) {
            nathanResult.classList.add('d-none');
            return;
        }
        
        // Simple processing (concatenate the numbers for now)
        const processedCode = `${val1}${val2}${val3}`;
        
        // Display result
        const t = translations[currentLanguage];
        nathanResultText.textContent = t.nathanResultText.replace('{0}', processedCode);
        nathanResult.classList.remove('d-none');
        
        console.log('Nathan code processed:', processedCode);
    }
    
    // Input validation for Nathan fields
    [nathan1, nathan2, nathan3].forEach(input => {
        input.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 9) this.value = 9;
            
            // Auto-process when all fields are filled
            processNathanCode();
        });
        
        input.addEventListener('keypress', function(e) {
            // Only allow numbers 1-9
            if (e.key < '1' || e.key > '9') {
                e.preventDefault();
            }
        });
    });

    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
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
    
    function updateActiveVariableButton(variable) {
        variableBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.variable === variable) {
                btn.classList.add('active');
            }
        });
    }
});
