import Swal from 'sweetalert2';

export const handleSuccess = (msg) => {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: msg,
        showConfirmButton: false,
        timer: 1500,
      });
}

export const handleError = (msg) => {
    Swal.fire({
        position: "top-end",
        icon: "warning",
        title: msg,
        showConfirmButton: false,
        timer: 1500,
      });
}