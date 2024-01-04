import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useFetchCustomerTaxStatusQuery,} from "../../../../../app/store/apis";
import Grid from "@mui/material/Grid";
import {Box, Paper, Typography} from "@mui/material";
import {Field, Form, FormElement} from "@progress/kendo-react-form";
import Button from "@mui/material/Button";
import {FormComboBoxVirtualCustomer} from "../../../../../app/common/form/FormComboBoxVirtualCustomer";
import SalesOrderItemsList from "../../../dashboard/order/SalesOrderItemsList";
import LoadingComponent from "../../../../../app/layout/LoadingComponent";
import {Menu, MenuItem, MenuSelectEvent} from "@progress/kendo-react-layout";
import {requiredValidator} from "../../../../../app/common/form/Validators";
import OrderAdjustmentsList from "../../../dashboard/order/OrderAdjustmentsList";
import OrderTotals from "../OrderTotals";

import {useAppDispatch, useAppSelector} from "../../../../../app/store/configureStore";
import OrderPaymentsList from "../../../dashboard/order/OrderPaymentsList";

import useSalesOrder from "../../../hook/useSalesOrder";
import {useSelector} from "react-redux";
import CreateCustomerModalForm from "../../../../parties/form/CreateCustomerModalForm";
import {orderSubTotal} from "../../../slice/orderSelectors";
import {resetUiOrderItems, setUiOrderItems} from "../../../slice/orderItemsUiSlice";
import {setCustomerId} from "../../../slice/sharedOrderUiSlice";
import ModalContainer from "../../../../../app/common/modals/ModalContainer";

interface Props {
    selectedOrder?: any
    editMode: number;
    cancelEdit: () => void;
}


export default function SalesOrderForm({selectedOrder, cancelEdit, editMode}: Props) {
    const [showList, setShowList] = useState(false);
    const [showPaymentList, setShowPaymentList] = useState(false);
    const [showNewCustomer, setShowNewCustomer] = useState(false);
    const formRef = React.useRef<any>();
    const formRef2 = React.useRef<boolean>(false);
    const [selectedMenuItem, setSelectedMenuItem] = React.useState('');

    const [isLoading, setIsLoading] = useState(false);
    const orderSTotal: any = useSelector(orderSubTotal);
    const customerId = useAppSelector(state => state.sharedOrderUi.selectedCustomerId);
    const {data: customerTaxStatus} = useFetchCustomerTaxStatusQuery(customerId,
        {skip: customerId === undefined});

    const language = useAppSelector(state => state.localization.language);

    console.count("SalesOrderForm Rendered");

    const {order, setOrder, formEditMode, setFormEditMode, handleCreate} = useSalesOrder({
        selectedMenuItem,
        editMode,
        formRef2,
        selectedOrder,
        setIsLoading
    });

    const memoizedSalesOrderItemsList = useMemo(() => <SalesOrderItemsList orderFormEditMode={formEditMode}
                                                                           orderId={order ? order.orderId : undefined}/>, [formEditMode, order]);

    const memoizedOrderTotals = useMemo(() => <OrderTotals/>);
    const dispatch = useAppDispatch();

    // console.log('selectedOrder', selectedOrder)


    useEffect(() => {
        if (selectedOrder) {
            setOrder(selectedOrder)
        }

    }, [selectedOrder, setOrder])

    useEffect(() => {
        if (formEditMode < 2) {
            setOrder(undefined)
        }

    }, [editMode, formEditMode, setOrder])

    const renderSwitchOrderStatus = () => {
        switch (formEditMode) {
            case 1:
                return 'New';
            case 2:
                return 'Created';
            case 3:
                return 'Approved';
            case 4:
                return 'Completed';
        }
    };

    useEffect(() => {
        renderSwitchOrderStatus()
    }, [formEditMode])

    // menu select event handler
    async function handleMenuSelect(e: MenuSelectEvent) {
        if (e.item.text === 'Create Order') {
            setSelectedMenuItem('Create Order');
            setTimeout(() => {
                formRef.current.onSubmit();
            });
        }
        if (e.item.text === 'Update Order') {
            setSelectedMenuItem('Update Order');
            setTimeout(() => {
                formRef.current.onSubmit();
            });
        }
        if (e.item.text === 'Approve Order') {
            setSelectedMenuItem('Approve Order');
            setTimeout(() => {
                formRef.current.onSubmit();
            });
        }
        if (e.item.text === 'New Order') {
            handleNewOrder()
        }
        if (e.item.text === 'Complete Order') {
            setSelectedMenuItem('Complete Order');
            setTimeout(() => {
                formRef.current.onSubmit();
            });
        }
        if (e.item.text === 'Order Adjustments') {
            setShowList(true);
        }
        if (e.item.text === 'Payments') {
            setShowPaymentList(true);
        }
    }


    const handleSubmit = (data: any) => {
        if (!data.isValid) {
            return false
        }
        setIsLoading(true);
        handleCreate(data);
    };

    const handleNewOrder = () => {
        setOrder(undefined)
        setFormEditMode(1)
        dispatch(setUiOrderItems([]));
        dispatch(resetUiOrderItems(null));
        formRef2.current = !formRef2.current
    }

    const handleCancelForm = () => {
        dispatch(setUiOrderItems([]));
        dispatch(resetUiOrderItems(null));
        formRef2.current = !formRef2.current
        cancelEdit()
    }

    const updateCustomerDropDown = (newCustomer: any) => {
        // Logic to update the DropDown in the parent with this new customer.
        formRef?.current.onChange("fromPartyId", {
            value: newCustomer.fromPartyId,
            valid: true,
        });
        dispatch(setCustomerId(newCustomer.fromPartyId.fromPartyId));
    };

    const memoizedOnClose2 = useCallback(
        () => {
            setShowNewCustomer(false)
        },
        [],
    );

    const memoizedOnClose = useCallback(
        () => {
            setShowList(false)
        },
        [],
    );


    return (
        <>
            {showList && (<ModalContainer show={showList} onClose={memoizedOnClose} width={900}>
                <OrderAdjustmentsList
                    onClose={memoizedOnClose}
                    orderId={formEditMode === 1 ? undefined : order?.orderId}
                />
            </ModalContainer>)}

            {showPaymentList && (<ModalContainer show={showPaymentList} onClose={memoizedOnClose} width={550}>
                <OrderPaymentsList
                    onClose={() => setShowPaymentList(false)}
                    partyId={customerId}
                    orderId={formEditMode === 1 ? undefined : order?.orderId}
                />
            </ModalContainer>)}

            {showNewCustomer && (<ModalContainer show={showNewCustomer} onClose={memoizedOnClose2} width={500}>
                <CreateCustomerModalForm
                    onClose={memoizedOnClose2}
                    onUpdateCustomerDropDown={updateCustomerDropDown}
                />
            </ModalContainer>)}
            <Paper
                dir={language === "ar" ? "rtl" : "ltr"}
                elevation={5}
                className={`div-container-withBorderCurved ${
                    language === "ar" ? "k-rtl" : ""
                }`}
            >
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid item xs={9}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography sx={{p: 2}} variant="h4" color={"green"}>
                                Order
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="col-md-6">
                            <Menu onSelect={handleMenuSelect}>
                                <MenuItem text="Actions">
                                    {formEditMode === 1 && <MenuItem text="Create Order"/>}
                                    {formEditMode === 2 && <MenuItem text="Approve Order"/>}
                                    {formEditMode === 2 && <MenuItem text="Update Order"/>}
                                    <MenuItem text="Duplicate Order"/>
                                    <MenuItem text="New Order"/>
                                    {formEditMode === 3 && <MenuItem text="Complete Order"/>}
                                </MenuItem>
                            </Menu>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid item xs={3}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography
                                sx={{p: 2, fontWeight: "bold"}}
                                color={formEditMode === 1 ? "green" : "black"}
                                variant="h6"
                            >
                                {" "}
                                {order ? `Order No: ${order?.orderId}` : "New Order"}{" "}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        {editMode > 1 && (
                            <Typography color="primary" sx={{p: 2}} variant="h5">
                                Status: {renderSwitchOrderStatus()}
                            </Typography>
                        )}
                    </Grid>
                </Grid>

                <Form
                    ref={formRef}
                    initialValues={order}
                    key={formRef2.current.toString()}
                    onSubmitClick={(values) => handleSubmit(values)}
                    render={(formRenderProps) => (
                        <FormElement>
                            <fieldset className={"k-form-fieldset"}>
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems="flex-end"
                                    sx={{paddingLeft: 3}}
                                >
                                    <Grid
                                        item
                                        xs={3}
                                        className={
                                            formEditMode > 2 ? "grid-disabled" : "grid-normal"
                                        }
                                    >
                                        <Field
                                            id={"fromPartyId"}
                                            name={"fromPartyId"}
                                            label={"Customer"}
                                            component={FormComboBoxVirtualCustomer}
                                            autoComplete={"off"}
                                            validator={requiredValidator}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button
                                            color={"secondary"}
                                            onClick={() => {
                                                setShowNewCustomer(true);
                                            }}
                                            variant="outlined"
                                        >
                                            New Customer
                                        </Button>
                                    </Grid>
                                    <Grid item xs={5}>
                                        {customerTaxStatus &&
                                            customerTaxStatus?.isExempt !== "N" && (
                                                <Typography
                                                    color="error"
                                                    sx={{padding: "1px"}}
                                                    variant="h6"
                                                >
                                                    Customer is Tax Exempt
                                                </Typography>
                                            )}
                                    </Grid>
                                </Grid>

                                <Grid container justifyContent="center">
                                    <Grid item xs={10}>
                                        {memoizedSalesOrderItemsList}
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Menu onSelect={handleMenuSelect} vertical={true}>
                                            <MenuItem
                                                text="Order Adjustments"
                                                disabled={orderSTotal === 0}
                                            />
                                            <MenuItem text="Payments" disabled={formEditMode < 3}/>
                                        </Menu>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} alignItems="flex-end">
                                    {memoizedOrderTotals}
                                </Grid>

                                <Grid container spacing={1}>
                                    <Grid item xs={1}>
                                        <Button
                                            sx={{m: 1}}
                                            onClick={handleCancelForm}
                                            color="error"
                                            variant="contained"
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>

                                {isLoading && (
                                    <LoadingComponent message="Processing Order..."/>
                                )}
                            </fieldset>
                        </FormElement>
                    )}
                />
            </Paper>
        </>
    );
}




