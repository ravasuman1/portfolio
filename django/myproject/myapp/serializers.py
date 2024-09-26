
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.contrib.auth.models import Permission

from rest_framework import serializers
from .models import Author, Book, Cart, Order,Category,OrderItem

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'name', 'codename', 'content_type')

class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)

    class Meta:
        model = Group
        fields = ('id', 'name', 'permissions')

class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)
   

    class Meta:
        model = User
        fields = ('id', 'username', 'groups')



class RegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "This email address is already in use."})
        
        return data

    def create(self, validated_data):
        # Extract the group name
        # group_name = validated_data.pop('group_name')
        
        # Create the user
        user = User.objects.create_user(**validated_data)
        
     
        # group= Group.objects.get(name=group_name)
        # if group is None:
        #      raise serializers.ValidationError("Your selected group doesnot exist.")
        
        # # Add the user to the group
        # user.groups.add(group)
        
        return user
    
# serializers.py

class CategorySerializer(serializers.ModelSerializer):
  
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    author = serializers.CharField(source='author.name', read_only=True) 
    class Meta:
        model = Book
        fields = ['id','title', 'author','description', 'published_date', 'author','cover_image', 'category','price','stock']


class AuthorSerializer(serializers.ModelSerializer):
    books = BookSerializer(many=True, read_only=True)

    class Meta:
        model = Author
        fields = ['id', 'name', 'bio', 'books']





class CartSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at','book', 'quantity']
    def get_books(self, obj):
        # Assuming Cart has a many-to-many relationship with Book
        books = obj.books.all()
        return BookSerializer(books, many=True).data
    
class OrderItemSerializer(serializers.ModelSerializer):
    book_name = serializers.CharField(source='book.title', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'book', 'book_name', 'quantity'] 

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'date_ordered', 'status', 'order_items']
