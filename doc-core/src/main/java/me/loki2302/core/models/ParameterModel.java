package me.loki2302.core.models;

import me.loki2302.core.Documented;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.group.GroupSequenceProvider;

import java.util.List;

@GroupSequenceProvider(ParameterModelGroupSequenceProvider.class)
public class ParameterModel {
    public String name;
    public String typeName;
    public boolean isDocumented;

    @NotEmpty(groups = Documented.class, message = "Missing a method parameter description. Please add a @param Javadoc tag.")
    public String description;

    public List<String> errors;
}
