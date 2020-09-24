const PhotosUpload = {
    input: '',
    preview: document.querySelector('#photos-preview'),
    uploadLimit: '',
    files: [],
    handleFileInput(event, uploadLimit) {
        const { files: fileList } = event.target;
        PhotosUpload.input = event.target;
        PhotosUpload.uploadLimit = uploadLimit;

        if (PhotosUpload.hasLimit(event)) return;

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file);
            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image;
                image.src = String(reader.result);

                const div = PhotosUpload.getContainer(image);
                PhotosUpload.preview.appendChild(div);
            };

            reader.readAsDataURL(file);
        });

        PhotosUpload.input.files = PhotosUpload.getAllfiles();
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload;
        const { files: fileList } = input;

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} imagens!`);
            event.preventDefault();

            return true;
        }

        const photoDiv = [];
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo') photoDiv.push(item);
        });

        const totalPhotos = fileList.length + photoDiv.length;
        if (totalPhotos > uploadLimit) {
            alert(`Você atingiu o limite máximo de ${uploadLimit} imagens!`);
            event.preventDefault();

            return true;
        }

        return false;
    },
    getAllfiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },
    getContainer(image) {
        const div = document.createElement('div');
        div.classList.add('photo');
        div.onclick = PhotosUpload.removePhoto;
        div.appendChild(image);
        div.appendChild(PhotosUpload.getRemoveButton());

        return div;
    },
    getRemoveButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close';

        return button;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(PhotosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv);

        PhotosUpload.files.splice(index, 1);
        PhotosUpload.input.files = PhotosUpload.getAllfiles();

        photoDiv.remove();
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            if (removedFiles) removedFiles.value += `${photoDiv.id},`;
        }

        photoDiv.remove();
    }
}