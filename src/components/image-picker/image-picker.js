"use client";

import classes from './image-picker.module.css';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function ImagePicker() {
    const [pickedImage, setPickedImage] = useState();
    const imageInput = useRef();

    function handleClick() {
        imageInput.current.click();
    }

    function handleImageChange(event) {
        const file = event.target.files[0];

        if (!file) {
            setPickedImage(null);
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            setPickedImage(fileReader.result);
        }

        fileReader.readAsDataURL(file);

    }

    return(
        <div className={classes.picker}>
            <label htmlFor='image'>Select image where necessary</label>
            <div className={classes.controls}>
                <div className={classes.preview}>
                    {!pickedImage && <p className={classes.previewText}>No image picked yet.<br/>.png or .jpeg</p>}
                    {pickedImage && (
                        <Image 
                            src={pickedImage}
                            alt='The image selected by user'
                            fill
                        />
                    )}
                </div>
                <input
                    className={classes.input}
                    type='file'
                    id='image'
                    accept='image/png, image/jpeg'
                    name='image'
                    ref={imageInput}
                    onChange={handleImageChange}
                />
                <button
                    onClick={handleClick}
                    className={classes.button}
                    type='button'
                >
                    Pick an image
                </button>
            </div>
        </div>
    );
}