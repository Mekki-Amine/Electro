package org.example.serviceelectro.servicees;

import org.example.serviceelectro.config.FileStorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final FileStorageProperties fileStorageProperties;

    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageProperties = fileStorageProperties;
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Impossible de créer le répertoire de stockage des fichiers.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Validation de la taille
        if (file.getSize() > fileStorageProperties.getMaxFileSize()) {
            throw new RuntimeException("Le fichier est trop volumineux. Taille maximale: " + 
                    (fileStorageProperties.getMaxFileSize() / 1024 / 1024) + " MB");
        }

        // Validation du type
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new RuntimeException("Impossible de déterminer le type du fichier");
        }
        boolean isAllowed = false;
        for (String allowedType : fileStorageProperties.getAllowedTypes()) {
            if (allowedType.equals(contentType)) {
                isAllowed = true;
                break;
            }
        }
        if (!isAllowed) {
            throw new RuntimeException("Type de fichier non autorisé: " + contentType);
        }

        // Normaliser le nom du fichier
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (originalFileName.contains("..")) {
            throw new RuntimeException("Nom de fichier invalide: " + originalFileName);
        }

        // Générer un nom de fichier unique
        String fileExtension = "";
        int lastDotIndex = originalFileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            fileExtension = originalFileName.substring(lastDotIndex);
        }
        String fileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // Copier le fichier dans le répertoire de destination
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Impossible de stocker le fichier " + fileName + ". Veuillez réessayer!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("Fichier non trouvé: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Fichier non trouvé: " + fileName, ex);
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Impossible de supprimer le fichier: " + fileName, ex);
        }
    }

    public String getFileUrl(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }
        return "/api/files/" + fileName;
    }
}

