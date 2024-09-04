export function setupMenuInteractions() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            toggleDropdown(dropdownContent);
        });
    });

    // Lukk dropdown når man klikker utenfor
    document.addEventListener('click', (e) => {
        if (!e.target.matches('.dropbtn')) {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                if (dropdown.style.display === 'block') {
                    toggleDropdown(dropdown);
                }
            });
        }
    });
}

function toggleDropdown(dropdown) {
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        dropdown.style.animation = 'fadeOut 0.3s ease-out';
    } else {
        dropdown.style.display = 'block';
        dropdown.style.animation = 'fadeIn 0.3s ease-in';
    }
}