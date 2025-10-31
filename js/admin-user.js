// File: js/admin-user.js

const mockUsers = [
    { id: 1, username: 'admin', email: 'admin@gmail.com', role: 'admin' },
    { id: 2, username: 'nguoidung_a', email: 'user_a@gmail.com', role: 'user' },
    { id: 3, username: 'bep_truong_b', email: 'user_b@gmail.com', role: 'user' },
    { id: 4, username: 'thanh_vien_c', email: 'user_c@gmail.com', role: 'user' },
];

document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.getElementById('user-table-body');

    function loadUserTable() {
        if (!tableBody) return;
        tableBody.innerHTML = ''; 

        mockUsers.forEach(user => {
            const tr = document.createElement('tr');
            
            // Nút "Set Admin" sẽ bị vô hiệu hóa nếu user đã là admin
            const adminButton = user.role === 'admin' ? 
                `<button class="btn btn-secondary" disabled>Đã là Admin</button>` :
                `<button class="btn btn-set-admin" data-id="${user.id}">Set Admin</button>`;

            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role}">${user.role}</span></td>
                <td class="table-actions">
                    ${adminButton}
                    <button class="btn btn-delete" data-id="${user.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        addTableEventListeners();
    }

    function addTableEventListeners() {
        document.querySelectorAll('.btn-set-admin').forEach(button => {
            button.addEventListener('click', (e) => toggleAdmin(e.target.dataset.id));
        });
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => deleteUser(e.target.dataset.id));
        });
    }

    function toggleAdmin(id) {
        if (confirm(`Bạn có chắc muốn cấp quyền Admin cho user ID: ${id} không?`)) {
            const user = mockUsers.find(u => u.id == id);
            if (user) {
                user.role = 'admin';
            }
            loadUserTable();
        }
    }

    function deleteUser(id) {
        if (confirm(`Bạn có chắc muốn XÓA user ID: ${id} không? Hành động này không thể hoàn tác.`)) {
            const index = mockUsers.findIndex(u => u.id == id);
            if (index > -1) {
                // Không cho xóa admin chính (id: 1)
                if (mockUsers[index].id === 1) {
                    alert('Không thể xóa tài khoản Admin chính!');
                    return;
                }
                mockUsers.splice(index, 1);
            }
            loadUserTable();
        }
    }
    
    loadUserTable();
});