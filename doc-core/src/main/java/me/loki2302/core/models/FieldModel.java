package me.loki2302.core.models;

import org.hibernate.validator.group.GroupSequenceProvider;

import java.util.List;

@GroupSequenceProvider(FieldModelGroupSequenceProvider.class)
public class FieldModel {
    public String fullName;
    public String name;
    public String typeName;

    public boolean isDocumented;

    //@NotEmpty(groups = Documented.class)
    public String description;

    public List<String> errors;
}
