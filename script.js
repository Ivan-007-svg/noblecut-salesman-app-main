document.addEventListener('DOMContentLoaded', async function () {

// --- FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "AIzaSyATvsgeJE6i7Q6vcXEd4Lo5fxZwASQNqsY",
  authDomain: "noble-cut.firebaseapp.com",
  projectId: "noble-cut",
  storageBucket: "noble-cut.appspot.com",
  messagingSenderId: "823877688810",
  appId: "1:823877688810:web:edcb9dd10fcb08984b6693"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function saveOrderToFirebase(order) {
  try {
    const orderedData = {
  'Client Name': formData['Client Name'],
  'Contact Info': formData['Contact Info'],
  'Order ID': formData['Order ID'],
  'Ordered Quantity': formData['Ordered Quantity'],
  'Order Date': formData['Order Date'],
  'Delivery Date': formData['Delivery Date'],
  'Fabric Supplier': formData['Fabric Supplier'],
  'Fabric Code': formData['Fabric Code'],
  'Fabric Color': formData['Fabric Color'],
  'Fabric Description': formData['Fabric Description'],
  'Fabric Consumption per Shirt': formData['Fabric Consumption per Shirt'],
  'Button Supplier': formData['Button Supplier'],
  'Button Article': formData['Button Article'],
  'Button Color': formData['Button Color'],
  'Shirt Line': formData['Shirt Line'],
  'Pattern': formData['Pattern'],
  'Collar Style': formData['Collar Style'],
  'Cuff Style': formData['Cuff Style'],
  'Placket Style': formData['Placket Style'],
  'Monogram': formData['Monogram'],
  'Monogram Text': formData['Monogram Text'],
  'Monogram Placement': formData['Monogram Placement'],
  'Monogram Color': formData['Monogram Color'],
  'Neck (cm)': formData['Neck (cm)'],
  'Chest (cm)': formData['Chest (cm)'],
  'Waist (cm)': formData['Waist (cm)'],
  'Hips (cm)': formData['Hips (cm)'],
  'Shoulder Width (cm)': formData['Shoulder Width (cm)'],
  'Across Shoulder': formData['Across Shoulder'],
  'Back Width': formData['Back Width'],
  'Sleeve Length (cm)': formData['Sleeve Length (cm)'],
  'Bicep (cm)': formData['Bicep (cm)'],
  'Under Elbow': formData['Under Elbow'],
  'Wrist (cm) Left': formData['Wrist (cm) Left'],
  'Wrist (cm) Right': formData['Wrist (cm) Right'],
  'Shirt Length (cm)': formData['Shirt Length (cm)'],
  'Order Notes': formData['Order Notes']
};
await db.collection('orders').doc(orderedData['Order ID']).set(orderedData);
    console.log("Order saved to Firebase:", order["Order ID"]);
  } catch (e) {
    console.error("Error saving to Firebase:", e);
  }
}

    const app = document.getElementById('app');
    const fabricApiUrl = 'https://script.google.com/macros/s/AKfycbz9Mn_Eitu8s3quSjoG5RV4Sa39Hoq0YRZYDhfsQrEPtW9xUxWCQ3RSooqrWDUZWRy9/exec';
    let fabricData = [];
    let dropdownOptions = {
        'Fabric Supplier': [],
        'Fabric Code': [],
        'Fabric Color': [],
        'Fabric Description': []
    };

    try {
        const response = await fetch(fabricApiUrl);
        const data = await response.json();
        fabricData = data;
        for (let row of data) {
            Object.keys(dropdownOptions).forEach(key => {
                if (row[key] && !dropdownOptions[key].includes(row[key])) {
                    dropdownOptions[key].push(row[key]);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching fabric data:", error);
    }

    const steps = [
        {
            title: 'Client & Order Info',
            fields: ['Client Name', 'Contact Info', 'Order ID', 'Ordered Quantity', 'Order Date', 'Delivery Date']
        },
        {
            title: 'Fabric & Button Info',
            fields: ['Fabric Supplier', 'Fabric Code', 'Fabric Color', 'Fabric Description', 'Fabric Consumption per Shirt', 'Button Supplier', 'Button Article', 'Button Color']
        },
        {
            title: 'Shirt Line & Model Info',
            fields: ['Shirt Line', 'Pattern', 'Collar Style', 'Cuff Style', 'Placket Style', 'Monogram', 'Monogram Text', 'Monogram Placement', 'Monogram Color']
        },
        {
            title: 'Measurements Part 1',
            fields: ['Neck (cm)', 'Chest (cm)', 'Waist (cm)', 'Hips (cm)', 'Shoulder Width (cm)', 'Across Shoulder', 'Back Width']
        },
        {
            title: 'Measurements Part 2 & Notes',
            fields: ['Sleeve Length (cm)', 'Bicep (cm)', 'Under Elbow', 'Wrist (cm) Left', 'Wrist (cm) Right', 'Shirt Length (cm)', 'Order Notes']
        }
    ];

    let currentStep = 0;
    const formData = {};
    let orderCounter = parseInt(localStorage.getItem('nobleCutOrderCounter') || '1');

    function createStep(stepIndex) {
        app.innerHTML = '';
        const step = steps[stepIndex];
        const section = document.createElement('section');
        const title = document.createElement('h2');
        title.textContent = step.title;
        section.appendChild(title);

        step.fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field;
            let input;

            if (field === 'Monogram') {
                input = document.createElement('select');
                ['-- Select --', 'YES', 'NO'].forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText === '-- Select --' ? '' : optionText;
                    option.textContent = optionText;
                    input.appendChild(option);
                });
            } else if (field === 'Order ID') {
                input = document.createElement('input');
                input.type = 'text';
                input.name = field;
                input.value = generateOrderID();
                input.readOnly = true;
            } else if (field === 'Order Date') {
                input = document.createElement('input');
                input.type = 'text';
                input.name = field;
                input.value = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                input.readOnly = true;
            } else if (field === 'Delivery Date') {
                input = document.createElement('input');
                input.type = 'date';
                input.name = field;
                input.addEventListener('change', () => {
                    input.setAttribute('data-formatted', formatDate(new Date(input.value)));
                });
            } else if (dropdownOptions[field]) {
                input = document.createElement('select');
                input.name = field;
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '-- Select --';
                input.appendChild(defaultOption);
                dropdownOptions[field].forEach(optionValue => {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.textContent = optionValue;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = 'text';
                input.name = field;
                input.value = formData[field] || '';
            }

            input.name = field;
            label.appendChild(input);
            section.appendChild(label);
        });

        const buttonContainer = document.createElement('div');
        if (stepIndex > 0) {
            const backBtn = document.createElement('button');
            backBtn.textContent = 'Back';
            backBtn.onclick = function () {
                saveStepData();
                currentStep--;
                createStep(currentStep);

    // Load Flatpickr calendar after UI is built
    const flatpickrScript = document.createElement('script');
    flatpickrScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    flatpickrScript.onload = () => { 
// --- FLATPICKR CUSTOM CALENDAR FOR DELIVERY DATE ---
const deliveryInput = document.querySelector('input[name="Delivery Date"]');
if (deliveryInput) {
    flatpickr(deliveryInput, {
        dateFormat: "F d, Y",
        defaultDate: "today",
        altInput: false
    });
}
 };
    document.head.appendChild(flatpickrScript);
    const flatpickrCSS = document.createElement('link');
    flatpickrCSS.rel = 'stylesheet';
    flatpickrCSS.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    document.head.appendChild(flatpickrCSS);
            };
            buttonContainer.appendChild(backBtn);
        }

        if (stepIndex < steps.length - 1) {
            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Next';
            nextBtn.onclick = function () {
                saveStepData();
                currentStep++;
                createStep(currentStep);

    // Load Flatpickr calendar after UI is built
    const flatpickrScript = document.createElement('script');
    flatpickrScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    flatpickrScript.onload = () => { 
// --- FLATPICKR CUSTOM CALENDAR FOR DELIVERY DATE ---
const deliveryInput = document.querySelector('input[name="Delivery Date"]');
if (deliveryInput) {
    flatpickr(deliveryInput, {
        dateFormat: "F d, Y",
        defaultDate: "today",
        altInput: false
    });
}
 };
    document.head.appendChild(flatpickrScript);
    const flatpickrCSS = document.createElement('link');
    flatpickrCSS.rel = 'stylesheet';
    flatpickrCSS.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    document.head.appendChild(flatpickrCSS);
            };
            buttonContainer.appendChild(nextBtn);
        } else {
            const submitBtn = document.createElement('button');
            submitBtn.textContent = 'Submit';
            submitBtn.onclick = function () {
                saveStepData();
                formData['Order Date'] = formatDate(new Date());
                if (formData['Delivery Date']) {
  const [year, month, day] = formData['Delivery Date'].split('-');
  const date = new Date(formData['Delivery Date']);
const options = { day: '2-digit', month: 'short', year: 'numeric' };
formData['Delivery Date'] = date.toLocaleDateString('en-GB', options).replace(/ /g, '/');
}
                saveOrderToFirebase(formData).then(() => showOrderSummary());
                showToast('Order submitted successfully!');
            };
            buttonContainer.appendChild(submitBtn);
        }

        section.appendChild(buttonContainer);
        app.appendChild(section);
        setupEnterKeyNavigation();
        if (step.title === 'Fabric & Button Info') {
            attachFabricFiltering();
        }
    }

    function formatDate(date) {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    }

    function saveStepData() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.name === 'Delivery Date' && input.type === 'date') {
                
    if (input.name === 'Delivery Date') {
        formData['Delivery Date'] = input.value;
    } else {
        formData[input.name] = input.value;
    }
    
            } else {
                formData[input.name] = input.value;
            }
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function generateOrderID() {
        const year = new Date().getFullYear().toString().slice(-2);
        const padded = orderCounter.toString().padStart(5, '0');
        return `NC-${padded}-${year}`;
    }

    function setupEnterKeyNavigation() {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const next = inputs[index + 1];
                    if (next) next.focus();
                }
            });
        });
    }

    function showOrderSummary() {
        app.innerHTML = '';
        const section = document.createElement('section');
        const title = document.createElement('h2');
        title.textContent = 'Order Summary';
        section.appendChild(title);

        const sectionGroups = {
            'Client & Order Info': ['Client Name', 'Contact Info', 'Order ID', 'Ordered Quantity', 'Order Date', 'Delivery Date'],
            'Fabric & Button Info': ['Fabric Supplier', 'Fabric Code', 'Fabric Color', 'Fabric Description', 'Fabric Consumption per Shirt', 'Button Supplier', 'Button Article', 'Button Color'],
            'Shirt Line & Model Info': ['Shirt Line', 'Pattern', 'Collar Style', 'Cuff Style', 'Placket Style', 'Monogram', 'Monogram Text', 'Monogram Placement', 'Monogram Color'],
            'Measurements': ['Neck (cm)', 'Chest (cm)', 'Waist (cm)', 'Hips (cm)', 'Shoulder Width (cm)', 'Across Shoulder', 'Back Width', 'Sleeve Length (cm)', 'Bicep (cm)', 'Under Elbow', 'Wrist (cm) Left', 'Wrist (cm) Right', 'Shirt Length (cm)'],
            'Order Notes': ['Order Notes']
        };

        for (const [group, fields] of Object.entries(sectionGroups)) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'print-section';

            const header = document.createElement('h3');
            header.textContent = group;
            groupDiv.appendChild(header);

            fields.forEach(field => {
                if (formData[field]) {
                    const p = document.createElement('p');
                    p.innerHTML = `<span class="label">${field}:</span> <span class="value">${formData[field]}</span>`;
                    groupDiv.appendChild(p);
                }
            });

            section.appendChild(groupDiv);
        }

        const printBtn = document.createElement('button');
        printBtn.textContent = 'Print Order';
        printBtn.className = 'no-print';
        printBtn.onclick = () => window.print();
        section.appendChild(printBtn);

        const newOrderBtn = document.createElement('button');
        newOrderBtn.textContent = 'New Order';
        newOrderBtn.className = 'no-print';
        newOrderBtn.onclick = () => {
            localStorage.setItem('nobleCutOrderCounter', ++orderCounter);
            Object.keys(formData).forEach(k => formData[k] = '');
            formData['Order ID'] = generateOrderID();
            currentStep = 0;
            createStep(currentStep);

    // Load Flatpickr calendar after UI is built
    const flatpickrScript = document.createElement('script');
    flatpickrScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    flatpickrScript.onload = () => { 
// --- FLATPICKR CUSTOM CALENDAR FOR DELIVERY DATE ---
const deliveryInput = document.querySelector('input[name="Delivery Date"]');
if (deliveryInput) {
    flatpickr(deliveryInput, {
        dateFormat: "F d, Y",
        defaultDate: "today",
        altInput: false
    });
}
 };
    document.head.appendChild(flatpickrScript);
    const flatpickrCSS = document.createElement('link');
    flatpickrCSS.rel = 'stylesheet';
    flatpickrCSS.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    document.head.appendChild(flatpickrCSS);
        };
        section.appendChild(newOrderBtn);

        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = 'Duplicate Order';
        duplicateBtn.className = 'no-print';
        duplicateBtn.onclick = () => {
            localStorage.setItem('nobleCutOrderCounter', ++orderCounter);
            formData['Order ID'] = generateOrderID();
            currentStep = 0;
            createStep(currentStep);

    // Load Flatpickr calendar after UI is built
    const flatpickrScript = document.createElement('script');
    flatpickrScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    flatpickrScript.onload = () => { 
// --- FLATPICKR CUSTOM CALENDAR FOR DELIVERY DATE ---
const deliveryInput = document.querySelector('input[name="Delivery Date"]');
if (deliveryInput) {
    flatpickr(deliveryInput, {
        dateFormat: "F d, Y",
        defaultDate: "today",
        altInput: false
    });
}
 };
    document.head.appendChild(flatpickrScript);
    const flatpickrCSS = document.createElement('link');
    flatpickrCSS.rel = 'stylesheet';
    flatpickrCSS.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    document.head.appendChild(flatpickrCSS);
        };
        section.appendChild(duplicateBtn);

        const footer = document.createElement('footer');
        const printDate = new Date();
        footer.textContent = `Printed on: ${printDate.toLocaleDateString('en-GB').replace(/\//g, '.')} — Noble Cut`;
        section.appendChild(footer);

        app.appendChild(section);
    }

    createStep(currentStep);

    // Load Flatpickr calendar after UI is built
    const flatpickrScript = document.createElement('script');
    flatpickrScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
    flatpickrScript.onload = () => { 
// --- FLATPICKR CUSTOM CALENDAR FOR DELIVERY DATE ---
const deliveryInput = document.querySelector('input[name="Delivery Date"]');
if (deliveryInput) {
    flatpickr(deliveryInput, {
        dateFormat: "F d, Y",
        defaultDate: "today",
        altInput: false
    });
}
 };
    document.head.appendChild(flatpickrScript);
    const flatpickrCSS = document.createElement('link');
    flatpickrCSS.rel = 'stylesheet';
    flatpickrCSS.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    document.head.appendChild(flatpickrCSS);

    const fabricFieldNames = ['Fabric Supplier', 'Fabric Code', 'Fabric Color', 'Fabric Description'];
    const fabricDropdowns = {};

    function attachFabricFiltering() {
        fabricFieldNames.forEach(name => {
            const el = document.querySelector(`[name="${name}"]`);
            if (el) {
                fabricDropdowns[name] = el;
                el.addEventListener('change', filterFabricFields);
            }
        });
    }

    function filterFabricFields() {
        const filters = {};
        fabricFieldNames.forEach(name => {
            const val = fabricDropdowns[name]?.value;
            if (val) {
                filters[name] = val;
            }
        });

        if (filters['Fabric Code']) {
            const match = fabricData.find(item => item['Fabric Code'] === filters['Fabric Code']);
            if (match) {
                fabricFieldNames.forEach(name => {
                    fabricDropdowns[name].value = match[name];
                });
                updateFabricDropdowns(match);
                return;
            }
        }

        updateFabricDropdowns(filters);
    }

    function updateFabricDropdowns(filters) {
        let filtered = fabricData;
        Object.entries(filters).forEach(([key, val]) => {
            if (val) {
                filtered = filtered.filter(item => item[key] === val);
            }
        });

        fabricFieldNames.forEach(name => {
            const select = fabricDropdowns[name];
            if (!select) return;
            const current = select.value;
            const options = [...new Set(filtered.map(row => row[name]))];
            select.innerHTML = '<option value="">-- Select --</option>';
            options.forEach(val => {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val;
                select.appendChild(opt);
            });
            if (options.includes(current)) {
                select.value = current;
            }
        });
    }
});

