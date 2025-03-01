
import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  FileBarChart, 
  Filter, 
  Plus, 
  PlusCircle, 
  Receipt, 
  Search, 
  Users 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import DataTable from '@/components/ui/DataTable';
import { useToast } from '@/hooks/use-toast';
import { 
  FeeCategory, 
  Payment, 
  FeeStructure, 
  FinanceStats, 
  FeeCategoryAmount
} from '@/types';

// Mock data for finance page
const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: '101',
    studentName: 'Arjun Sharma',
    class: '10',
    section: 'A',
    rollNumber: '1001',
    amount: 25000,
    paymentDate: '2023-08-10',
    dueDate: '2023-08-15',
    paymentMethod: 'Online Payment',
    receiptNumber: 'REC-10001',
    status: 'Paid',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 15000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 5000 },
      { categoryId: '3', categoryName: 'Computer Lab Fee', amount: 3000 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 2000 }
    ]
  },
  {
    id: '2',
    studentId: '102',
    studentName: 'Priya Patel',
    class: '9',
    section: 'B',
    rollNumber: '902',
    amount: 25000,
    paymentDate: '2023-08-12',
    dueDate: '2023-08-15',
    paymentMethod: 'Credit Card',
    receiptNumber: 'REC-10002',
    status: 'Paid',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 15000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 5000 },
      { categoryId: '3', categoryName: 'Computer Lab Fee', amount: 3000 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 2000 }
    ]
  },
  {
    id: '3',
    studentId: '103',
    studentName: 'Vikram Singh',
    class: '11',
    section: 'A',
    rollNumber: '1103',
    amount: 30000,
    paymentDate: '',
    dueDate: '2023-08-15',
    paymentMethod: 'Cash',
    receiptNumber: 'REC-10003',
    status: 'Pending',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 18000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 7000 },
      { categoryId: '3', categoryName: 'Computer Lab Fee', amount: 3000 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 2000 }
    ]
  },
  {
    id: '4',
    studentId: '104',
    studentName: 'Anjali Gupta',
    class: '12',
    section: 'C',
    rollNumber: '1204',
    amount: 30000,
    paymentDate: '2023-07-20',
    dueDate: '2023-07-15',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'REC-10004',
    status: 'Overdue',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 18000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 7000 },
      { categoryId: '3', categoryName: 'Computer Lab Fee', amount: 3000 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 2000 }
    ]
  },
  {
    id: '5',
    studentId: '105',
    studentName: 'Raj Malhotra',
    class: '10',
    section: 'B',
    rollNumber: '1005',
    amount: 25000,
    paymentDate: '2023-08-05',
    dueDate: '2023-08-15',
    paymentMethod: 'Online Payment',
    receiptNumber: 'REC-10005',
    status: 'Partially Paid',
    remarks: 'Remaining amount to be paid by September',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 15000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 5000 },
      { categoryId: '3', categoryName: 'Computer Lab Fee', amount: 3000 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 2000 }
    ]
  }
];

const mockFeeCategories: FeeCategory[] = [
  {
    id: '1',
    name: 'Tuition Fee',
    description: 'Regular monthly tuition fee',
    amount: 15000,
    frequency: 'Quarterly',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  {
    id: '2',
    name: 'Development Fee',
    description: 'Fee for school infrastructure development',
    amount: 5000,
    frequency: 'Annually',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: '3',
    name: 'Computer Lab Fee',
    description: 'Fee for computer lab usage and maintenance',
    amount: 3000,
    frequency: 'Quarterly',
    applicableClasses: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: '4',
    name: 'Library Fee',
    description: 'Fee for library usage and book maintenance',
    amount: 2000,
    frequency: 'Annually',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: '5',
    name: 'Exam Fee',
    description: 'Fee for conducting examinations',
    amount: 1500,
    frequency: 'Quarterly',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  }
];

const mockFeeStructures: FeeStructure[] = [
  {
    id: '1',
    academicYear: '2023-2024',
    standard: '1-5',
    categories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 12000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 4000 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 1500 }
    ],
    totalAmount: 17500
  },
  {
    id: '2',
    academicYear: '2023-2024',
    standard: '6-8',
    categories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 14000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 4500 },
      { categoryId: '3', categoryName: 'Computer Lab Fee', amount: 2500 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 1500 }
    ],
    totalAmount: 22500
  },
  {
    id: '3',
    academicYear: '2023-2024',
    standard: '9-10',
    categories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 15000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 5000 },
      { categoryId: '3', categoryName: 'Computer Lab Fee', amount: 3000 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 2000 }
    ],
    totalAmount: 25000
  },
  {
    id: '4',
    academicYear: '2023-2024',
    standard: '11-12',
    categories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 18000 },
      { categoryId: '2', categoryName: 'Development Fee', amount: 7000 },
      { categoryId: '3', categoryName: 'Computer Lab Fee', amount: 3000 },
      { categoryId: '4', categoryName: 'Library Fee', amount: 2000 }
    ],
    totalAmount: 30000
  }
];

const mockFinanceStats: FinanceStats = {
  totalCollected: 75000,
  pendingAmount: 55000,
  overdueAmount: 30000,
  totalStudentsPaid: 3,
  totalStudentsPending: 2
};

// Payment status badge colors
const getStatusColor = (status: Payment['status']) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-50 text-green-600 border-green-100';
    case 'Pending':
      return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    case 'Overdue':
      return 'bg-red-50 text-red-600 border-red-100';
    case 'Partially Paid':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    default:
      return '';
  }
};

const Finance = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');

  // Function to format date to display
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to filter payments based on search query
  const filteredPayments = mockPayments.filter(payment => 
    payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle new payment submission
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddPaymentDialog(false);
    toast({
      title: "Payment Added Successfully",
      description: "The student payment has been recorded.",
    });
  };

  // Function to handle new fee category submission
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddCategoryDialog(false);
    toast({
      title: "Fee Category Added",
      description: "The new fee category has been created successfully.",
    });
  };

  // Column definitions for payment table
  const paymentColumns = [
    {
      accessor: (row: Payment) => row.receiptNumber,
      header: "Receipt #",
      cell: (row: Payment) => row.receiptNumber,
      sortable: true
    },
    {
      accessor: (row: Payment) => row.studentName,
      header: "Student",
      cell: (row: Payment) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{row.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.studentName}</div>
            <div className="text-xs text-muted-foreground">
              Class {row.class}-{row.section} | Roll #{row.rollNumber}
            </div>
          </div>
        </div>
      ),
      sortable: true
    },
    {
      accessor: (row: Payment) => row.amount,
      header: "Amount",
      cell: (row: Payment) => `₹${row.amount.toLocaleString()}`,
      sortable: true
    },
    {
      accessor: (row: Payment) => row.paymentDate,
      header: "Payment Date",
      cell: (row: Payment) => formatDate(row.paymentDate),
      sortable: true
    },
    {
      accessor: (row: Payment) => row.status,
      header: "Status",
      cell: (row: Payment) => (
        <Badge variant="outline" className={getStatusColor(row.status)}>
          {row.status}
        </Badge>
      ),
      sortable: true
    },
    {
      accessor: (row: Payment) => row.paymentMethod,
      header: "Payment Method",
      cell: (row: Payment) => row.paymentMethod,
      sortable: true
    }
  ];

  // Column definitions for fee categories table
  const feeCategoryColumns = [
    {
      accessor: (row: FeeCategory) => row.name,
      header: "Category Name",
      cell: (row: FeeCategory) => row.name,
      sortable: true
    },
    {
      accessor: (row: FeeCategory) => row.description,
      header: "Description",
      cell: (row: FeeCategory) => row.description,
      sortable: true
    },
    {
      accessor: (row: FeeCategory) => row.amount,
      header: "Amount",
      cell: (row: FeeCategory) => `₹${row.amount.toLocaleString()}`,
      sortable: true
    },
    {
      accessor: (row: FeeCategory) => row.frequency,
      header: "Frequency",
      cell: (row: FeeCategory) => row.frequency,
      sortable: true
    },
    {
      accessor: (row: FeeCategory) => row.applicableClasses.join(', '),
      header: "Applicable Classes",
      cell: (row: FeeCategory) => row.applicableClasses.join(', '),
      sortable: true
    }
  ];

  // Column definitions for fee structure table
  const feeStructureColumns = [
    {
      accessor: (row: FeeStructure) => row.academicYear,
      header: "Academic Year",
      cell: (row: FeeStructure) => row.academicYear,
      sortable: true
    },
    {
      accessor: (row: FeeStructure) => row.standard,
      header: "Classes",
      cell: (row: FeeStructure) => row.standard,
      sortable: true
    },
    {
      accessor: (row: FeeStructure) => row.totalAmount,
      header: "Total Amount",
      cell: (row: FeeStructure) => `₹${row.totalAmount.toLocaleString()}`,
      sortable: true
    },
    {
      accessor: (row: FeeStructure) => row.categories.length,
      header: "Categories",
      cell: (row: FeeStructure) => `${row.categories.length} categories`,
      sortable: true
    }
  ];

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">Manage student fees, payments, and financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddPaymentDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
          <TabsTrigger value="categories">Fee Categories</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{mockFinanceStats.totalCollected.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  For current academic year
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{mockFinanceStats.pendingAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {mockFinanceStats.totalStudentsPending} students pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">₹{mockFinanceStats.overdueAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Payments past due date
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockFinanceStats.totalStudentsPaid}</div>
                <p className="text-xs text-muted-foreground">
                  Out of {mockFinanceStats.totalStudentsPaid + mockFinanceStats.totalStudentsPending} students
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                  Latest fee payments received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPayments.slice(0, 3).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{payment.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{payment.studentName}</p>
                          <p className="text-xs text-muted-foreground">Class {payment.class}-{payment.section}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(payment.paymentDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setCurrentTab('payments')}>
                  View All Payments
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Distribution of payment methods used
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-6">
                <div className="text-center">
                  <div className="text-muted-foreground mb-4">Payment Method Distribution</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span className="text-xs">Online</span>
                        </div>
                        <span className="text-xs font-medium">40%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span className="text-xs">Cash</span>
                        </div>
                        <span className="text-xs font-medium">20%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-xs">Card</span>
                        </div>
                        <span className="text-xs font-medium">30%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span className="text-xs">Bank</span>
                        </div>
                        <span className="text-xs font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View and manage all student payments
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search payments..."
                      className="pl-8 w-full md:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={filteredPayments}
                columns={paymentColumns}
                className="border rounded-md"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fee-structure" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Fee Structures</CardTitle>
                    <CardDescription>
                      Manage fee structures for different classes
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Structure
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={mockFeeStructures}
                  columns={feeStructureColumns}
                  className="border rounded-md"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Structure Details</CardTitle>
                <CardDescription>
                  Fee breakup for selected structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Classes 9-10 (2023-2024)</h3>
                    <div className="space-y-2">
                      {mockFeeStructures[2].categories.map((category) => (
                        <div key={category.categoryId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{category.categoryName}</span>
                          <span>₹{category.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{mockFeeStructures[2].totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Fee Categories</CardTitle>
                  <CardDescription>
                    Manage different types of fees
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowAddCategoryDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable 
                data={mockFeeCategories}
                columns={feeCategoryColumns}
                className="border rounded-md"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Access and generate financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Collection Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      Comprehensive report of all fee collections for the current academic year
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Defaulters List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      List of students with overdue fee payments
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Class-wise Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      Report showing fee collection status for each class
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      Month-wise breakdown of fee collections
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Payment Dialog */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
            <DialogDescription>
              Enter the payment details below to record a new fee payment.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPayment}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="student">Student</Label>
                  <Select defaultValue="">
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">Arjun Sharma (10A)</SelectItem>
                      <SelectItem value="102">Priya Patel (9B)</SelectItem>
                      <SelectItem value="103">Vikram Singh (11A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input id="amount" type="number" placeholder="Enter amount" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input id="paymentDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select defaultValue="Cash">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Online Payment">Online Payment</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeCategories">Fee Categories</Label>
                <div className="border rounded-md p-3 space-y-2">
                  {mockFeeCategories.slice(0, 3).map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <Label htmlFor={`category-${category.id}`} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          className="mr-2 h-4 w-4"
                          defaultChecked
                        />
                        {category.name}
                      </Label>
                      <Input
                        type="number"
                        className="w-24 h-8"
                        defaultValue={category.amount}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Input id="remarks" placeholder="Add any additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Fee Category Dialog */}
      <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Fee Category</DialogTitle>
            <DialogDescription>
              Create a new fee category for student payments.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCategory}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input id="categoryName" placeholder="e.g. Sports Fee" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description of the fee" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input id="amount" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select defaultValue="Quarterly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Annually">Annually</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Applicable Classes</Label>
                <div className="border rounded-md p-3 grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                    <div key={cls} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`class-${cls}`}
                        defaultChecked
                        className="mr-1 h-4 w-4"
                      />
                      <Label htmlFor={`class-${cls}`} className="text-sm cursor-pointer">
                        Class {cls}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;
