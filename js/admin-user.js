// File: js/admin-user.js
const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'ADMIN') {
        alert("Không có quyền truy cập!");
        window.location.href = 'index.html';
        return;
    }
    loadUsers();

    // Gán sự kiện cho Form Sửa
    document.getElementById('userForm').addEventListener('submit', handleUpdateSubmit);
});

// --- LOAD DANH SÁCH ---
async function loadUsers() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/users`);
        const users = await res.json();
        const tbody = document.getElementById('user-table-body');
        tbody.innerHTML = '';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        users.forEach(u => {
            let roleHtml = u.role === 'ADMIN' ? `<b style="color:red">ADMIN</b>` : `<b style="color:green">USER</b>`;
            let buttons = '';
            
            if (currentUser.email === u.email) {
                buttons = `<span style="color:#aaa">(Bạn)</span>`;
            } else {
                const roleBtnText = u.role === 'ADMIN' ? 'Xuống USER' : 'Lên ADMIN';
                const roleBtnColor = u.role === 'ADMIN' ? '#7f8c8d' : '#e67e22';
                
                buttons = `
                    <button class="btn" style="background:#3498db; color:white; padding:5px 8px; margin-right:5px; border:none; border-radius:4px; cursor:pointer;" onclick="openEditModal(${u.id}, '${u.userName}', '${u.email}')">Sửa</button>
                    
                    <button class="btn" style="background:${roleBtnColor}; color:white; padding:5px 8px; margin-right:5px; border:none; border-radius:4px; cursor:pointer;" onclick="changeRole(${u.id}, '${u.role === 'ADMIN' ? 'USER' : 'ADMIN'}')">${roleBtnText}</button>
                    
                    <button class="btn" style="background:#c0392b; color:white; padding:5px 8px; border:none; border-radius:4px; cursor:pointer;" onclick="deleteUser(${u.id})">Xóa</button>
                `;
            }

            tbody.innerHTML += `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.userName}</td>
                    <td>${u.email}</td>
                    <td>${roleHtml}</td>
                    <td style="text-align:center">${buttons}</td>
                </tr>
            `;
        });
    } catch (err) { console.error(err); }
}

function openEditModal(id, name, email) {
    document.getElementById('userId').value = id;
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    document.getElementById('userModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

// --- XỬ LÝ SỬA (UPDATE) ---
async function handleUpdateSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('userId').value;
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;

    console.log("Đang gửi update:", { userName, email });

    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            // Key 'userName' phải khớp với Backend mong đợi
            body: JSON.stringify({ userName: userName, email: email })
        });

        if (res.ok) {
            alert("Cập nhật thành công!");
            closeModal();
            loadUsers();
        } else {
            const txt = await res.text();
            alert("Lỗi cập nhật: " + txt);
        }
    } catch (err) { console.error(err); }
}

// --- ĐỔI QUYỀN ---
async function changeRole(id, newRole) {
    if (!confirm(`Đổi quyền thành ${newRole}?`)) return;
    try {
        await fetch(`${API_BASE_URL}/api/users/${id}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        loadUsers();
    } catch (e) { alert("Lỗi!"); }
}

// --- XÓA USER ---
async function deleteUser(id) {
    if (!confirm("CẢNH BÁO: Xóa tài khoản này sẽ xóa hết món ăn của họ. Bạn chắc chắn chứ?")) return;
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
        
        if (res.ok) {
            alert("Đã xóa tài khoản!");
            loadUsers();
        } else {
            const errorText = await res.text();
            alert("Không thể xóa: " + errorText);
        }
    } catch (e) { 
        alert("Lỗi kết nối Backend!"); 
    }
}

window.onclick = function(event) {
    if (event.target == document.getElementById('userModal')) closeModal();
}