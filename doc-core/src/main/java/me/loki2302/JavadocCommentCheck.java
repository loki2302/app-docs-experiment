package me.loki2302;

import com.puppycrawl.tools.checkstyle.api.AbstractFileSetCheck;
import com.puppycrawl.tools.checkstyle.api.CheckstyleException;
import com.thoughtworks.qdox.JavaProjectBuilder;
import com.thoughtworks.qdox.model.JavaClass;
import me.loki2302.core.*;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

public class JavadocCommentCheck extends AbstractFileSetCheck {
    @Override
    protected void processFiltered(File file, List<String> lines) throws CheckstyleException {
        try {
            JavaProjectBuilder javaProjectBuilder = new JavaProjectBuilder();
            try {
                javaProjectBuilder.addSource(file);
            } catch (IOException e) {
                throw new CheckstyleException("Can't load " + file.getAbsolutePath(), e);
            }

            Collection<JavaClass> javaClasses = javaProjectBuilder.getClasses();
            for (JavaClass javaClass : javaClasses) {
                ModellingResult modellingResult = CodebaseModelBuilder.modelClass(javaClass);

                if (modellingResult instanceof SkipModellingResult) {
                    continue;
                }

                if (modellingResult instanceof ErrorModellingResult) {
                    ErrorModellingResult errorClassModel = (ErrorModellingResult) modellingResult;
                    log(0, errorClassModel.message);
                    continue;
                }

                if (modellingResult instanceof SuccessfulModellingResult) {
                    // OK
                    continue;
                }

                throw new RuntimeException();
            }
        } catch (Throwable t) {
            log(0, String.format("error! %s", t.getMessage()));
            throw new CheckstyleException("Unexpected error", t);
        }
    }
}