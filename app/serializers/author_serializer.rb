class AuthorSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :email, :type, :avatar
end
