export const uploadImage = async (file: File): Promise<string> => {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name is not configured');
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'recycling_app_uploads');
  
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }
  
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error details:', error);
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }; 