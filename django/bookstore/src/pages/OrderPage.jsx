import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, MoreHorizontal, Search } from 'lucide-react'
import MainPageLayout from '@/MainPageLayout'
import { useQuery } from 'react-query'
import axiosInstance from '@/axiosConfig'

// Mock data for orders
const orders = [
    { id: '1', customer: 'John Doe', date: '2023-06-01', total: 125.99, status: 'Completed' },
    { id: '2', customer: 'Jane Smith', date: '2023-06-02', total: 85.50, status: 'Processing' },
    { id: '3', customer: 'Bob Johnson', date: '2023-06-03', total: 220.00, status: 'Shipped' },
    { id: '4', customer: 'Alice Brown', date: '2023-06-04', total: 65.75, status: 'Pending' },
    { id: '5', customer: 'Charlie Davis', date: '2023-06-05', total: 175.25, status: 'Completed' },
]

export default function OrderPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')

    const filteredOrders = orders
        .filter(order =>
            (statusFilter === 'All' || order.status === statusFilter) &&
            (order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.includes(searchTerm))
        )
        .sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
            } else if (sortBy === 'total') {
                return sortOrder === 'asc' ? a.total - b.total : b.total - a.total
            }
            return 0
        })

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(column)
            setSortOrder('asc')
        }
    }
    const { data } = useQuery('orderItems', () => axiosInstance.get('/order'))
    
    return (
        <MainPageLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Orders</h1>
                {/* <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Order ID</TableHead>
                                <TableHead >Items</TableHead>
                                
                                <TableHead className="cursor-pointer" >
                                    Date 
                                </TableHead>
                                <TableHead className="cursor-pointer" >
                                    Total 
                                </TableHead>
                                <TableHead>Status</TableHead>
                               
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.order_items?.map((val)=><p>{val.book_name} {val.quantity},</p>)}</TableCell>
                                    <TableCell>{order.date_ordered}</TableCell>
                                    <TableCell>${order.total_price}</TableCell>
                                  
                                    <TableCell>
                                        <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </MainPageLayout>
    )
}