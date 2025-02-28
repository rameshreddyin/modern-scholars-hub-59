
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  Plus, 
  Search, 
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import StatCard from '@/components/dashboard/StatCard';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Payment, FinanceStats, FeeCategory, FeeStructure } from '@/types';

// Mock data for demo purposes
const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: 'ST001',
    studentName: 'Rahul Sharma',
    class: '10',
    section: 'A',
    rollNumber: '1001',
    amount: 25000,
    paymentDate: '2023-04-15',
    dueDate: '2023-04-10',
    paymentMethod: 'Online Payment',
    receiptNumber: 'REC-20230415-001',
    status: 'Paid',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 15000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 5000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 5000 }
    ]
  },
  {
    id: '2',
    studentId: 'ST002',
    studentName: 'Priya Patel',
    class: '9',
    section: 'B',
    rollNumber: '901',
    amount: 25000,
    paymentDate: '',
    dueDate: '2023-04-10',
    paymentMethod: 'Cash',
    receiptNumber: '',
    status: 'Pending',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 15000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 5000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 5000 }
    ]
  },
  {
    id: '3',
    studentId: 'ST003',
    studentName: 'Amit Singh',
    class: '8',
    section: 'A',
    rollNumber: '801',
    amount: 22000,
    paymentDate: '2023-03-05',
    dueDate: '2023-03-10',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'REC-20230305-003',
    status: 'Paid',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 12000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 5000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 5000 }
    ]
  },
  {
    id: '4',
    studentId: 'ST004',
    studentName: 'Neha Gupta',
    class: '11',
    section: 'C',
    rollNumber: '1101',
    amount: 30000,
    paymentDate: '',
    dueDate: '2023-02-15',
    paymentMethod: 'Credit Card',
    receiptNumber: '',
    status: 'Overdue',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 20000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 5000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 5000 }
    ]
  },
  {
    id: '5',
    studentId: 'ST005',
    studentName: 'Karan Joshi',
    class: '12',
    section: 'A',
    rollNumber: '1201',
    amount: 30000,
    paymentDate: '2023-04-12',
    dueDate: '2023-04-15',
    paymentMethod: 'Cheque',
    receiptNumber: 'REC-20230412-005',
    status: 'Paid',
    feeCategories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 20000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 5000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 5000 }
    ]
  }
];

const mockCategories: FeeCategory[] = [
  {
    id: '1',
    name: 'Tuition Fee',
    description: 'Regular tuition fee',
    amount: 15000,
    frequency: 'Quarterly',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  {
    id: '2',
    name: 'Computer Lab',
    description: 'Computer laboratory fee',
    amount: 5000,
    frequency: 'Annually',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: '3',
    name: 'Library Fee',
    description: 'Access to library resources',
    amount: 5000,
    frequency: 'Annually',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: '4',
    name: 'Sports Fee',
    description: 'Sports activities and equipment',
    amount: 3000,
    frequency: 'Annually',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: '5',
    name: 'Development Fee',
    description: 'School infrastructure development',
    amount: 8000,
    frequency: 'Annually',
    applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  }
];

const mockFeeStructures: FeeStructure[] = [
  {
    id: '1',
    academicYear: '2023-2024',
    standard: '1-5',
    categories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 10000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 3000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 2000 },
      { categoryId: '4', categoryName: 'Sports Fee', amount: 2000 },
      { categoryId: '5', categoryName: 'Development Fee', amount: 5000 }
    ],
    totalAmount: 22000
  },
  {
    id: '2',
    academicYear: '2023-2024',
    standard: '6-8',
    categories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 12000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 5000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 5000 },
      { categoryId: '4', categoryName: 'Sports Fee', amount: 3000 },
      { categoryId: '5', categoryName: 'Development Fee', amount: 8000 }
    ],
    totalAmount: 33000
  },
  {
    id: '3',
    academicYear: '2023-2024',
    standard: '9-10',
    categories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 15000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 5000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 5000 },
      { categoryId: '4', categoryName: 'Sports Fee', amount: 3000 },
      { categoryId: '5', categoryName: 'Development Fee', amount: 8000 }
    ],
    totalAmount: 36000
  },
  {
    id: '4',
    academicYear: '2023-2024',
    standard: '11-12',
    categories: [
      { categoryId: '1', categoryName: 'Tuition Fee', amount: 20000 },
      { categoryId: '2', categoryName: 'Computer Lab', amount: 5000 },
      { categoryId: '3', categoryName: 'Library Fee', amount: 5000 },
      { categoryId: '4', categoryName: 'Sports Fee', amount: 3000 },
      { categoryId: '5', categoryName: 'Development Fee', amount: 8000 }
    ],
    totalAmount: 41000
  }
];

// Calculate statistics from payment data
const calculateStats = (payments: Payment[]): FinanceStats => {
  const totalCollected = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const pendingAmount = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const overdueAmount = payments
    .filter(p => p.status === 'Overdue')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalStudentsPaid = new Set(
    payments
      .filter(p => p.status === 'Paid')
      .map(p => p.studentId)
  ).size;
  
  const totalStudentsPending = new Set(
    payments
      .filter(p => p.status === 'Pending' || p.status === 'Overdue')
      .map(p => p.studentId)
  ).size;
  
  return {
    totalCollected,
    pendingAmount,
    overdueAmount,
    totalStudentsPaid,
    totalStudentsPending
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const Finance = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const stats = calculateStats(mockPayments);
  
  // Table columns for payments
  const paymentColumns = [
    {
      accessor: 'receiptNumber',
      header: 'Receipt No.',
      cell: (row: Payment) => row.receiptNumber || '-'
    },
    {
      accessor: 'studentName',
      header: 'Student',
      cell: (row: Payment) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.studentName}</span>
          <span className="text-xs text-muted-foreground">
            Class {row.class}-{row.section}, Roll: {row.rollNumber}
          </span>
        </div>
      )
    },
    {
      accessor: 'amount',
      header: 'Amount',
      cell: (row: Payment) => formatCurrency(row.amount)
    },
    {
      accessor: 'paymentDate',
      header: 'Payment Date',
      cell: (row: Payment) => row.paymentDate || '-'
    },
    {
      accessor: 'dueDate',
      header: 'Due Date',
      cell: (row: Payment) => row.dueDate
    },
    {
      accessor: 'paymentMethod',
      header: 'Method',
      cell: (row: Payment) => row.paymentMethod
    },
    {
      accessor: 'status',
      header: 'Status',
      cell: (row: Payment) => (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Paid' ? 'bg-green-100 text-green-800' :
          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          row.status === 'Overdue' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {row.status}
        </div>
      )
    }
  ];
  
  // Table columns for fee categories
  const categoryColumns = [
    {
      accessor: 'name',
      header: 'Category Name',
      cell: (row: FeeCategory) => row.name
    },
    {
      accessor: 'description',
      header: 'Description',
      cell: (row: FeeCategory) => row.description
    },
    {
      accessor: 'amount',
      header: 'Amount',
      cell: (row: FeeCategory) => formatCurrency(row.amount)
    },
    {
      accessor: 'frequency',
      header: 'Frequency',
      cell: (row: FeeCategory) => row.frequency
    },
    {
      accessor: 'applicableClasses',
      header: 'Classes',
      cell: (row: FeeCategory) => row.applicableClasses.join(', ')
    }
  ];
  
  // Table columns for fee structures
  const structureColumns = [
    {
      accessor: 'academicYear',
      header: 'Academic Year',
      cell: (row: FeeStructure) => row.academicYear
    },
    {
      accessor: 'standard',
      header: 'Classes',
      cell: (row: FeeStructure) => row.standard
    },
    {
      accessor: 'categories',
      header: 'Categories',
      cell: (row: FeeStructure) => `${row.categories.length} categories`
    },
    {
      accessor: 'totalAmount',
      header: 'Total Amount',
      cell: (row: FeeStructure) => formatCurrency(row.totalAmount)
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Finance Management</h1>
          <p className="text-muted-foreground">Manage school fees, payments, and financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            2023-2024
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Collected"
          value={formatCurrency(stats.totalCollected)}
          icon={DollarSign}
          description="This academic year"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Pending Amount"
          value={formatCurrency(stats.pendingAmount)}
          icon={CreditCard}
          description="Upcoming payments"
          trend={{ value: 5.2, isPositive: false }}
        />
        <StatCard
          title="Overdue Amount"
          value={formatCurrency(stats.overdueAmount)}
          icon={AlertCircle}
          description="Past due date"
          trend={{ value: 8.7, isPositive: false }}
        />
        <StatCard
          title="Students Paid"
          value={`${stats.totalStudentsPaid}/${stats.totalStudentsPaid + stats.totalStudentsPending}`}
          icon={CheckCircle2}
          description="Complete payments"
          trend={{ value: 15.3, isPositive: true }}
        />
      </div>
      
      <div className="bg-card rounded-lg border border-border shadow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <TabsList>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="categories">Fee Categories</TabsTrigger>
              <TabsTrigger value="structure">Fee Structure</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-[200px] lg:w-[250px]"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Payment</DialogTitle>
                    <DialogDescription>
                      Record a new payment from a student
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="student" className="text-right">
                        Student
                      </label>
                      <Input id="student" className="col-span-3" placeholder="Select student" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="amount" className="text-right">
                        Amount
                      </label>
                      <Input id="amount" className="col-span-3" type="number" placeholder="Enter amount" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="payment-method" className="text-right">
                        Method
                      </label>
                      <Input id="payment-method" className="col-span-3" placeholder="Payment method" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="date" className="text-right">
                        Date
                      </label>
                      <Input id="date" className="col-span-3" type="date" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Payment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <TabsContent value="payments" className="p-0">
            <DataTable 
              data={mockPayments} 
              columns={paymentColumns}
              onRowClick={(row) => console.log('Payment clicked:', row)}
            />
          </TabsContent>
          
          <TabsContent value="categories" className="p-0">
            <DataTable 
              data={mockCategories} 
              columns={categoryColumns}
              onRowClick={(row) => console.log('Category clicked:', row)}
            />
          </TabsContent>
          
          <TabsContent value="structure" className="p-0">
            <DataTable 
              data={mockFeeStructures} 
              columns={structureColumns}
              onRowClick={(row) => console.log('Structure clicked:', row)}
            />
            <div className="p-4 border-t">
              <h3 className="font-medium mb-2">Details for selected structure</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Class 9-10 Fee Structure (2023-2024)</CardTitle>
                  <CardDescription>Total: {formatCurrency(36000)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockFeeStructures[2].categories.map(cat => (
                      <div key={cat.categoryId} className="flex justify-between items-center">
                        <span>{cat.categoryName}</span>
                        <span>{formatCurrency(cat.amount)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Collection Summary</CardTitle>
                  <CardDescription>Monthly breakdown of fees collected</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Collection chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Distribution by payment type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Payment methods chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Class-wise Collection</CardTitle>
                  <CardDescription>Fee collection by class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Class-wise collection chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Finance;
