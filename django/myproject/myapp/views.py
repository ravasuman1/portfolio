
import logging
from rest_framework.exceptions import NotFound
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer,RegistrationSerializer
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group
from rest_framework.permissions import IsAuthenticated
from .expectations import format_errors;
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Author, Book, Cart, Order,Category,OrderItem
from .serializers import AuthorSerializer, BookSerializer,  OrderSerializer,CategorySerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.exceptions import NotFound
logger = logging.getLogger(__name__)
from .serializers import CartSerializer
class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to update or delete.
    Non-admin users can only read data.
    """

    def has_permission(self, request, view):
        # Allow read-only access for non-authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Allow full access only to admin users
        return request.user and request.user.is_staff

class GroupListView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        # Exclude the admin group (assuming its ID is 1)
        groups = Group.objects.exclude(id=1)
        group_data = [{'id': group.id, 'name': group.name} for group in groups]
        return Response(group_data, status=status.HTTP_200_OK)
    
class UserRegistrationView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            print(user)

           
            return Response({
                'username': user.username,
                'email': user.email,
                
            }, status=status.HTTP_201_CREATED)
        return Response(format_errors(serializer.errors), status=status.HTTP_400_BAD_REQUEST)

	

class UserLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs): 
      
        username = request.data.get('username')
        password = request.data.get('password')
       
        user = authenticate(request,username=username, password=password)

      

      
        if user is not None:
            login(request, user)
    
            # groups = get_user_groups(user)
    

            # model_permissions = get_model_permissions(permissions)
            token, created = Token.objects.get_or_create(user=user)
            if created:
                token.delete()  # Delete the token if it was already created
                token = Token.objects.create(user=user)
            
            user_data = UserSerializer(user).data
            return Response({'token': token.key, 'user_data': user_data })
                   
        return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)



class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]
    print(permission_classes)

    def post(self, request):
        print(request.headers) 
        token_key = request.auth.key
        token = Token.objects.get(key=token_key)
        token.delete()

        return Response({'detail': 'Successfully logged out.'})





    



class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class =  CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        # Return the cart for the current user
        return Cart.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Calculate total price and total quantity
        total_price = sum(item.get_total_price() for item in queryset)
        total_quantity = sum(item.quantity for item in queryset)

        # Custom response with totals
        response_data = {
            'cart_items': serializer.data,
            'total_price': total_price,
            'total_quantity': total_quantity
        }

        return Response(response_data)

    def get_cart_item(self, book_id):
        return Cart.objects.filter(user=self.request.user, book_id=book_id).first()
        
    def create(self, request):
        book_id = request.data.get('book_id')
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            return Response({'error': 'Quantity must be positive'}, status=status.HTTP_400_BAD_REQUEST)

        book = Book.objects.filter(id=book_id).first()
        if not book:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item = self.get_cart_item(book_id)
        if cart_item:
            # Update existing item
            cart_item.quantity += quantity
            cart_item.save()
        else:
            # Create new item
            Cart.objects.create(user=request.user, book=book, quantity=quantity)
        
        return Response({'status': 'Item added to cart'}, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        cart_item = self.get_object()
        

        # Get the quantity from the request data
        quantity = request.data.get('quantity')

        if quantity is None:
            return Response({'error': 'Quantity is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
            if quantity <= 0:
                return Response({'error': 'Quantity must be a positive integer'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the quantity of the cart item
        cart_item.quantity = quantity
        cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)
     
  
   
    def delete(self, request, *args, **kwargs):
        """
        Delete a specific cart item.
        """
        cart_item = self.get_object()
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


    

   

class OrderViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        # Get the orders for the authenticated user
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        # Fetch the user's cart items
        cart = Cart.objects.filter(user=request.user)

        if not cart.exists():
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total price
        total_price = sum(item.get_total_price() for item in cart)

        # Begin a transaction
        from django.db import transaction
        try:
            with transaction.atomic():
                # Create the order with the associated cart
                order = Order.objects.create(cart=cart.first(), user=request.user, total_price=total_price)

                # Create OrderItems for each item in the cart
                for item in cart:
                    OrderItem.objects.create(order=order, book=item.book, quantity=item.quantity)

                # Clear the cart after creating the order
            cart.delete()

            return Response({"detail": "Order created successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error creating order: {e}", exc_info=True)
            return Response({"detail": "Failed to create order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

       



    
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Author.objects.all()
        return Author.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        try:
            author = self.get_queryset().get(pk=kwargs['pk'])
        except Author.DoesNotExist:
            raise NotFound("Author not found")
        serializer = self.get_serializer(author)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        try:
            author = self.get_queryset().get(pk=kwargs['pk'])
        except Author.DoesNotExist:
            raise NotFound("Author not found")
        serializer = self.get_serializer(author, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        try:
            author = self.get_queryset().get(pk=kwargs['pk'])
        except Author.DoesNotExist:
            raise NotFound("Author not found")
        self.perform_destroy(author)
        return Response(status=status.HTTP_204_NO_CONTENT)


class BookListView(APIView):
    def get(self, request, *args, **kwargs):
        category_id = request.query_params.get('category', None)
        if category_id:
            try:
                category_id = int(category_id)
                books = Book.objects.filter(category_id=category_id)
            except ValueError:
                return Response({"error": "Invalid category ID"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            books = Book.objects.all()

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


    def get_queryset(self):
       return Book.objects.all()
       

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise permissions.PermissionDenied("You must be logged in to create a book.")
        author, created = Author.objects.get_or_create(user=self.request.user)
        serializer.save(author=author)

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        return super().destroy(request, *args, **kwargs)





  

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
