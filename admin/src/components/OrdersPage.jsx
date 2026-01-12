import React, { useEffect, useState } from 'react'
import { ordersPageStyles as styles } from '../assets/adminStyles'
import { FiCheck, FiCreditCard, FiEdit, FiMail, FiMapPin, FiPackage, FiPhone, FiTruck, FiUser, FiX } from 'react-icons/fi'
import { BsCurrencyRupee } from 'react-icons/bs'
import axios from 'axios'

const OrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/orders')
            setOrders(data);
            setFilteredOrders(data)
        }
        catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        let result = [...orders];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(order =>
                order.id.toLowerCase().includes(term) ||
                order.customer.name.toLowerCase().includes(term) ||
                order.customer.phone.includes(term) ||
                (order.customer.email && order.customer.email.toLowerCase().includes(term)))
        }
        if (statusFilter !== 'All') {
            result = result.filter(order => order.status === statusFilter);
        }
        setFilteredOrders(result)
    }, [orders, searchTerm, statusFilter, paymentFilter]);

    //UPDATE THE ORDER USING ID
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:4000/api/orders/${orderId}`,
                { status: newStatus }
            );
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            setFilteredOrders((prev) =>
                prev.map((o) =>
                    (o._id === orderId ? { ...o, status: newStatus } : o)
                )
            )
        }
        catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    //CANCEL ORDERS
    const cancelOrder = (orderId) => {
        updateOrderStatus(orderId, 'Cancelled');
    }

    //MODEL OPEN FOR MORE DETAIL OF ORDER
    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    //CLOSE MODEL
    const closeModel = () => {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.innerContainer}>
                {/* HEADER  */}
                <div className={styles.headerContainer}>
                    <h1 className={styles.headerTitle}>Order Management</h1>
                    <p className={styles.headerSubtitle}>View, manage, and track customer orders</p>
                </div>

                {/* STATS GRID  */}
                <div className={styles.statsGrid}>
                    <div className={styles.statsCard('border-blue-500')}>
                        <div className={styles.statsCardInner}>
                            <div className={styles.statsCardIconContainer('bg-blue-100')}>
                                <FiPackage className={styles.statsCardIcon('text-blue-600')} />
                            </div>
                            <div>
                                <p className={styles.statsCardLabel}>Track Orders</p>
                                <p className={styles.statsCardValue}>{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.statsCard('border-amber-500')}>
                        <div className={styles.statsCardInner}>
                            <div className={styles.statsCardIconContainer('bg-amber-100')}>
                                <FiTruck className={styles.statsCardIcon('text-amber-600')} />
                            </div>
                            <div>
                                <p className={styles.statsCardLabel}>Processing</p>
                                <p className={styles.statsCardValue}>{orders.filter(o => o.status === 'Processing').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.statsCard('border-emerald-500')}>
                        <div className={styles.statsCardInner}>
                            <div className={styles.statsCardIconContainer('bg-emerald-100')}>
                                <FiCheck className={styles.statsCardIcon('text-emerald-600')} />
                            </div>
                            <div>
                                <p className={styles.statsCardLabel}>Delivered</p>
                                <p className={styles.statsCardValue}>{orders.filter(o => o.status === 'Delivered').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.statsCard('border-red-500')}>
                        <div className={styles.statsCardInner}>
                            <div className={styles.statsCardIconContainer('bg-red-100')}>
                                <BsCurrencyRupee className={styles.statsCardIcon('text-red-600')} />
                            </div>
                            <div>
                                <p className={styles.statsCardLabel}>Pending Payment</p>
                                <p className={styles.statsCardValue}>{orders.filter(o => o.paymentStatus === 'Unpaid').length}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ORDERS TABLE  */}
                <div className={styles.contentContainer}>
                    <div className="overflow-x-auto">
                        <table className={styles.table}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th className={styles.tableHeaderCell}>Order ID</th>
                                    <th className={styles.tableHeaderCell}>Customer</th>
                                    <th className={styles.tableHeaderCell}>Date</th>
                                    <th className={styles.tableHeaderCell}>Items</th>
                                    <th className={styles.tableHeaderCell}>Total</th>
                                    <th className={styles.tableHeaderCell}>Status</th>
                                    <th className={styles.tableHeaderCell}>Payment</th>
                                    <th className={styles.tableHeaderCell}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan='8' className={styles.emptyStateCell}>
                                            <div className={styles.emptyStateContainer}>
                                                <FiPackage className={styles.emptyStateIcon} />
                                                <h3 className={styles.emptyStateTitle}>No orders found</h3>
                                                <p className={styles.emptyStateText}>Try changing your filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order._id} className={styles.tableRowHover}>
                                            <td className={`${styles.tableDataCell} ${styles.orderId}`}>
                                                {order.orderId}
                                            </td>
                                            <td className={styles.tableDataCell}>
                                                <div className='font-medium'>{order.customer.name}</div>
                                                <div className='text-sm text-gray-500'>{order.customer.phone}</div>
                                            </td>
                                            <td className={`${styles.tableDataCell} text-sm text-gray-500`}>{order.date}</td>
                                            <td className={`${styles.tableDataCell} text-sm text-gray-500`}>{order.items.length} items</td>
                                            <td className={`${styles.tableDataCell} font-medium`}>₹{order.total.toFixed(2)}</td>
                                            <td className={styles.tableDataCell}>
                                                <span className={styles.statusBadge(order.status)}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className={styles.tableDataCell}>
                                                <span className={styles.paymentBadge(order.paymentStatus)}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className={styles.tableDataCell}>
                                                <div className={styles.actionButtons}>
                                                    <button className={styles.viewButton} onClick={() => viewOrderDetails(order)}>
                                                        View
                                                    </button>
                                                    <button className={styles.cancelButton(order.status === 'Cancelled' || order.status === 'Delivered')}
                                                        disabled={order.status === 'Cancelled' || order.status === 'Delivered'} onClick={() => cancelOrder(order._id)}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ORDER DETAILS  */}
            {isDetailModalOpen && selectedOrder && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        {/* MODEL HEADER  */}
                        <div className={styles.modalHeader}>
                            <div className='flex justify-between items-center'>
                                <h2 className={styles.modalHeaderTitle}>
                                    Order Details: {selectedOrder._id}
                                </h2>
                                <button onClick={closeModel} className={styles.modalHeaderClose}>
                                    <FiX size={24} />
                                </button>
                            </div>
                            <p className='text-gray-600 mt-1'>
                                Ordered on {selectedOrder.date}
                            </p>
                        </div>

                        {/* MODAL BODY  */}
                        <div className={styles.modalBody}>
                            <div className={styles.modalGrid}>
                                {/* LEFT SIDE  */}
                                <div>
                                    <div className={styles.modalSection}>
                                        <h3 className={styles.modalSectionTitle}>
                                            <FiUser className={styles.modalIcon} />
                                            Customer Information
                                        </h3>
                                        <div className={styles.modalInfoBox}>
                                            <div className='mb-3'>
                                                <div className='font-medium'>{selectedOrder.customer.name}</div>
                                                <div className='text-gray-600 flex items-center mt-1'>
                                                    <FiMail className="mr-2 flex-shrink-0" />
                                                    {selectedOrder.customer.mail || 'No mail provided'}
                                                </div>
                                                <div className='text-gray-600 flex items-center mt-1'>
                                                    <FiPhone className="mr-2 flex-shrink-0" />
                                                    {selectedOrder.customer.phone}
                                                </div>
                                            </div>
                                            <div className='flex items-start mt-3'>
                                                <FiMapPin className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                                <div className='text-gray-600'>{selectedOrder.customer.address}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ORDER NOTES  */}
                                    {selectedOrder.notes && (
                                        <div className={styles.modalSection}>
                                            <h3 className={styles.modalSectionTitle}>
                                                <FiEdit className={styles.modalIcon} />
                                                Delivery Notes
                                            </h3>
                                            <div className={styles.modalNoteBox}>
                                                <p className='text-gray-700'>{selectedOrder.notes}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* STATUS CONTROL  */}
                                    <div className={styles.modalSection}>
                                        <h3 className={styles.modalSectionTitle}>
                                            Update Order Status
                                        </h3>
                                        <div className={styles.modalStatusControl}>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Order Status
                                                </label>
                                                <select value={selectedOrder.status} onChange={(e) => {
                                                    const newStatus = e.target.value;
                                                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                                                    updateOrderStatus(selectedOrder._id, newStatus);
                                                }} className={styles.modalSelect}>
                                                    {statusOptions.filter(o => o !== 'All').map(option => (
                                                        <option value={option} key={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT SIDE  */}
                                <div>
                                    <div className={styles.modalSection}>
                                        <h3 className={styles.modalSectionTitle}>
                                            <FiPackage className={styles.modalIcon} />
                                            Order Summary
                                        </h3>
                                        <div className={styles.modalOrderSummary}>
                                            {selectedOrder.items.map((item, index) => (
                                                <div key={item._id || index} className={styles.modalOrderItem(index, selectedOrder.items.length)}>
                                                    {item.imageUrl ? (
                                                        <img src={`http://localhost:4000${item.imageUrl}`} alt={item.name} className={styles.modalOrderImage} />
                                                    ) : (
                                                        <div className={styles.modalPlaceholderImage}></div>
                                                    )}
                                                    <div className='flex-grow'>
                                                        <div className='font-medium'>{item.name}</div>
                                                        <div className='text-gray-600'>
                                                            ₹{item.price.toFixed(2)} x {item.quantity}{" "}
                                                        </div>
                                                    </div>
                                                    <div className='font-medium'>
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* ORDER TOTALS  */}
                                            <div className={styles.modalOrderTotalSection}>
                                                <div className={styles.modalOrderTotalRow}>
                                                    <span className="text-gray-600">Subtotal</span>
                                                    <span className="font-medium">₹{selectedOrder.total.toFixed(2)}</span>
                                                </div>
                                                <div className={styles.modalOrderTotalRow}>
                                                    <span className="text-gray-600">Shipping</span>
                                                    <span className="font-medium text-emerald-600">Free</span>
                                                </div>
                                                <div className={styles.modalOrderTotalRow}>
                                                    <span className="text-gray-600">Tax (5%)</span>
                                                    <span className="font-medium">₹{(selectedOrder.total * 0.05).toFixed(2)}</span>
                                                </div>
                                                <div className={styles.modalOrderTotalRowLast}>
                                                    <span className="text-lg font-bold">Total</span>
                                                    <span className="text-lg font-bold text-emerald-700">
                                                        ₹{(selectedOrder.total * 1.05).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PAYMENT INFO  */}
                                    <div>
                                        <h3 className={styles.modalSectionTitle}>
                                            <FiCreditCard className={styles.modalIcon} />
                                            Payment Information
                                        </h3>
                                        <div className={styles.modalInfoBox}>
                                            <div className='flex justify-between mb-3'>
                                                <span className='text-gray-600'>Payment Method:</span>
                                                <span className='font-medium'>
                                                    {selectedOrder.paymentMethod}
                                                </span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-600'>Payment Status:</span>
                                                <span className={styles.paymentBadge(selectedOrder.paymentStatus)}>
                                                    {selectedOrder.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MODAL FOOTER  */}
                        <div className={styles.modalFooter}>
                            <div className='flex justify-end space-x-3'>
                                <button className={styles.modalFooterButton}
                                onClick={closeModel}>
                                    Close
                                </button>
                                <button onClick={closeModel} className={styles.modalFooterPrimaryButton}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrdersPage