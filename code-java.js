const form = document.getElementById('registrationForm');
const tableBody = document.getElementById('studentTableBody');
const emptyMessage = document.getElementById('emptyMessage');
const statTotalCount = document.getElementById('statTotalCount');

const fields = {
  studentId: document.getElementById('studentId'),
  fullName: document.getElementById('fullName'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  course: document.getElementById('course'),
  dob: document.getElementById('dob')
};

function validateField(id, value) {
  const existingRecords = JSON.parse(localStorage.getItem('studentRecords')) || [];
  
  switch (id) {
    case 'studentId':
      const isDuplicate = existingRecords.some(s => s.studentId.toLowerCase() === value.trim().toLowerCase());
      return value.trim() !== '' && !isDuplicate;
    case 'fullName':
      return /^[a-zA-Z\s]{3,}$/.test(value.trim());
    case 'email':
      return /^\S+@\S+\.\S+$/.test(value.trim());
    case 'phone':
      return /^[0-9]{10}$/.test(value.trim());
    case 'course':
      return value !== '';
    case 'dob':
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 16;
    default:
      return true;
  }
}

function toggleError(fieldId, isValid) {
  const inputEl = fields[fieldId];
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (isValid) {
    inputEl.classList.remove('error');
    errorEl.classList.remove('active');
  } else {
    inputEl.classList.add('error');
    errorEl.classList.add('active');
  }
}

Object.keys(fields).forEach(key => {
  fields[key].addEventListener('input', () => {
    const isValid = validateField(key, fields[key].value);
    toggleError(key, isValid);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isFormValid = true;
  const formData = {};

  Object.keys(fields).forEach(key => {
    const value = fields[key].value;
    const isValid = validateField(key, value);
    toggleError(key, isValid);
    if (!isValid) {
      isFormValid = false;
    } else {
      formData[key] = value.trim();
    }
  });

  if (isFormValid) {
    saveStudent(formData);
    form.reset();
    renderTable();
  }
});

function saveStudent(data) {
  const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
  records.push(data);
  localStorage.setItem('studentRecords', JSON.stringify(records));
}

window.deleteStudent = function(studentId) {
  let records = JSON.parse(localStorage.getItem('studentRecords')) || [];
  records = records.filter(student => student.studentId !== studentId);
  localStorage.setItem('studentRecords', JSON.stringify(records));
  renderTable();
};

function getBadgeClass(course) {
  switch(course) {
    case 'Computer Science': return 'badge-cs';
    case 'Information Technology': return 'badge-it';
    case 'Electronics': return 'badge-ece';
    case 'Mechanical': return 'badge-mech';
    default: return 'badge-default';
  }
}

function renderTable() {
  const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
  tableBody.innerHTML = '';
  statTotalCount.textContent = records.length;

  if (records.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';

  records.forEach(student => {
    const row = document.createElement('tr');
    const badgeClass = getBadgeClass(student.course);

    row.innerHTML = `
      <td class="student-id-cell">${student.studentId}</td>
      <td><strong>${student.fullName}</strong></td>
      <td><span class="badge ${badgeClass}">${student.course}</span></td>
      <td>${student.phone}</td>
      <td>
        <button class="delete-btn" onclick="deleteStudent('${student.studentId}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

renderTable();