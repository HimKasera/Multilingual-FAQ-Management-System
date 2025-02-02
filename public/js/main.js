document.addEventListener('DOMContentLoaded', () => {
    const adminDashboard = document.getElementById('adminDashboard');
    let faqs = [];

    // Check authentication
    const token = localStorage.getItem('auth_token');
    if (!token) {
        renderLoginForm();
    } else {
        fetchAndRenderFAQs();
    }

    function renderLoginForm() {
        adminDashboard.innerHTML = `
            <div class="flex min-h-screen items-center justify-center">
                <form id="loginForm" class="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 class="text-2xl font-bold mb-6">Admin Login</h2>
                    <input type="text" id="username" placeholder="Username" class="w-full p-2 mb-4 border rounded">
                    <input type="password" id="password" placeholder="Password" class="w-full p-2 mb-4 border rounded">
                    <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
                </form>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }

    async function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('auth_token', data.token);
                fetchAndRenderFAQs();
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    async function fetchAndRenderFAQs() {
        try {
            console.log("Fetching FAQs...");  // Debugging step
            const response = await fetch('/api/faqs', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            faqs = await response.json();
            renderDashboard();
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    }

    function renderDashboard() {
        adminDashboard.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold">FAQ Management</h1>
                    <button onclick="handleLogout()" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 class="text-xl font-semibold mb-4">Add New FAQ</h2>
                    <form id="faqForm" class="space-y-4">
                        <div>
                            <label class="block mb-2">Question</label>
                            <input type="text" id="question" class="w-full p-2 border rounded">
                        </div>
                        <div>
                            <label class="block mb-2">Answer</label>
                            <textarea id="answer" class="w-full p-2 border rounded"></textarea>
                        </div>
                        <div>
                            <label class="block mb-2">Languages</label>
                            <select id="languages" multiple class="w-full p-2 border rounded">
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="bn">Bengali</option>
                            </select>
                        </div>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Add FAQ</button>
                    </form>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-xl font-semibold mb-4">Existing FAQs</h2>
                    <div id="faqsList" class="space-y-4">
                        ${faqs.map(faq => `
                            <div class="border-b pb-4">
                                <h3 class="font-semibold">${faq.question}</h3>
                                <div>${faq.answer}</div>
                                <div class="mt-2 text-sm text-gray-500">
                                    Languages: ${faq.languages.join(', ')}
                                </div>
                                <div class="mt-2">
                                    <button onclick="deleteFAQ('${faq._id}')" class="text-red-500 mr-2">Delete</button>
                                    <button onclick="editFAQ('${faq._id}')" class="text-blue-500">Edit</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Initialize TinyMCE
        tinymce.init({
            selector: '#answer',
            height: 300,
            menubar: false,
            plugins: ['lists', 'link', 'table', 'code', 'help', 'wordcount'],
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent'
        });

        document.getElementById('faqForm').addEventListener('submit', handleFAQSubmit);
    }

    async function handleFAQSubmit(e) {
        e.preventDefault();
        const formData = {
            question: document.getElementById('question').value,
            answer: tinymce.get('answer').getContent(),
            languages: Array.from(document.getElementById('languages').selectedOptions).map(opt => opt.value)
        };

        try {
            const response = await fetch('/api/faqs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchAndRenderFAQs();
                document.getElementById('faqForm').reset();
                tinymce.get('answer').setContent('');
            }
        } catch (error) {
            console.error('Error creating FAQ:', error);
        }
    }

    window.handleLogout = () => {
        localStorage.removeItem('auth_token');
        renderLoginForm();
    };

    window.deleteFAQ = async (id) => {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            try {
                await fetch(`/api/faqs/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                fetchAndRenderFAQs();
            } catch (error) {
                console.error('Error deleting FAQ:', error);
            }
        }
    };

    window.editFAQ = (id) => {
        const faq = faqs.find(f => f._id === id);
        if (faq) {
            document.getElementById('question').value = faq.question;
            tinymce.get('answer').setContent(faq.answer);
            document.getElementById('languages').value = faq.languages;
        }
    };
});