// InvoiceForm.jsx
import { useState, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { Upload, Delete, Add } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const invoiceSchema = Yup.object().shape({
  vendor: Yup.string().required("Vendor is Required"),
  purchaseOrderNumber: Yup.string().required(
    "Purchase Order Number is Required"
  ),
  invoiceNumber: Yup.string().required("Invoice Number is Required"),
  invoiceDate: Yup.date().required("Invoice Date is Required"),
  totalAmount: Yup.number().required("Total Amount is Required").min(0),
  paymentTerms: Yup.string().required("Payment Terms is Required"),
  invoiceDueDate: Yup.date().required("Invoice Due Date is Required"),
  glPostDate: Yup.date().required("GL Post Date is Required"),
  invoiceDescription: Yup.string().required("Invoice Description is Required"),
  expenseDetails: Yup.array().of(
    Yup.object().shape({
      lineAmount: Yup.number().required("Line Amount is Required"),
      department: Yup.string().required("Department is Required"),
      account: Yup.string().required("Account is Required"),
      location: Yup.string().required("Location is Required"),
      description: Yup.string().required("Description is Required"),
    })
  ),
});

const InvoiceForm = () => {
  const uploadImage = `/images/uploadicon.svg`;
  const vendorImage = `/images/vendoricon.svg`;
  const invoiceImage = `/images/invoiceicon.svg`;
  const commentsImage = `/images/comments.svg`;
  const [fileUpload, setFileUpload] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [initialValues, setInitialValues] = useState({
    vendor: "",
    purchaseOrderNumber: "",
    invoiceNumber: "",
    invoiceDate: "",
    invoiceDueDate: "",
    glPostDate: "",
    totalAmount: "",
    paymentTerms: "",
    invoiceDescription: "",
    expenseDetails: [
      {
        lineAmount: "",
        department: "",
        account: "",
        location: "",
        description: "",
      },
    ],
    comments: "",
  });
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const TabPanel = ({ value, index, children }) => {
    return (
      value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )
    );
  };

  useEffect(() => {
    const storedFormValues =
      JSON.parse(localStorage.getItem("formValues")) || {};
    const storedFileValues = JSON.parse(localStorage.getItem("file")) || {};

    // If form data exists in localStorage, set it as initial values
    if (storedFormValues && Object.keys(storedFormValues).length > 0) {
      setInitialValues(storedFormValues);
    }
    if (storedFileValues && Object.keys(storedFileValues).length > 0) {
      setFileUpload(storedFileValues);
    }
  }, []);
  const handleFileUpload = (event) => {
    setFileUpload(event.target.files[0]);
  };

  const handleSubmit = (values, { resetForm }) => {
    const newInvoice = {
      ...values,
      id: Date.now(),
      file: fileUpload?.name,
      status: "submitted",
    };

    localStorage.setItem("formValues", JSON.stringify(values));
    localStorage.setItem("file", JSON.stringify(fileUpload));

    const existingInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const newInvoices = [...existingInvoices, newInvoice];
    localStorage.setItem("invoices", JSON.stringify(newInvoices));

    setSavedInvoices(newInvoices);
    resetForm();
    // setFileUpload(null);

    enqueueSnackbar("Form Submitted!", {
      variant: "success",
    });
  };

  const handleSaveDraft = (values) => {
    const draftInvoice = {
      ...values,
      id: Date.now(),
      file: fileUpload?.name,
      status: "draft",
    };
    localStorage.setItem("formValues", JSON.stringify(values));
    localStorage.setItem("file", JSON.stringify(fileUpload));
    const newInvoices = [...savedInvoices, draftInvoice];
    localStorage.setItem("invoices", JSON.stringify(newInvoices));
    setSavedInvoices(newInvoices);

    enqueueSnackbar("Draft Saved", {
      variant: "success",
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const triggerFileInput = (e) => {
    document.getElementById("invoice-upload").click();
    handleFileUpload(e);
  };

  return (
    <div>
      <div className="invoice-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h4">Create New Invoice</Typography>

          <div
            style={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="tabs"
              centered
            >
              <Tab label="Vendor Details" />
              <Tab label="Invoice Details" />
              <Tab label="Comments" />
            </Tabs>
          </div>

          <Button
            variant="outlined"
            size="small"
            color="error"
            sx={{ width: "10px", height: "40px" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <div className="two-column-layout">
          <div className="upload-section">
            <label htmlFor="invoice-upload">
              <Card sx={{ height: "90%" }}>
                <CardContent>
                  <input
                    type="file"
                    id="invoice-upload"
                    hidden
                    onChange={handleFileUpload}
                  />

                  <Typography variant="h5">Upload Your Invoice</Typography>
                  <Typography variant="body1">
                    To auto-populate fields and save time
                  </Typography>
                  <img src={uploadImage} alt="upload Image" />
                  <Box className="upload-container">
                    <Button
                      variant="outlined"
                      endIcon={<Upload />}
                      className="upload-button"
                      type="file"
                      id="invoice-upload"
                      onClick={triggerFileInput}
                    >
                      Upload File
                    </Button>
                    <Typography
                      variant="body2"
                      className="upload-text"
                      marginTop={2}
                    >
                      <span>Click to upload</span> or Drag and drop
                    </Typography>
                    <span>{fileUpload?.name}</span>
                  </Box>
                </CardContent>
              </Card>
            </label>
          </div>

          <div className="vendor-details-section">
            <Box sx={{ width: "100%" }}>
              <TabPanel value={selectedTab} index={0}>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validationSchema={invoiceSchema}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                  }) => (
                    <Form>
                      <div style={{ marginBottom: "20px" }}>
                        <>
                          <div className="flex-display">
                            <img src={vendorImage} alt="vendor image" />
                            <Typography variant="h6" gutterBottom m={3}>
                              Vendor and Invoice Details
                            </Typography>
                          </div>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                select
                                name="vendor"
                                label="Vendor"
                                variant="outlined"
                                value={values.vendor}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.vendor && Boolean(errors.vendor)}
                                helperText={touched.vendor && errors.vendor}
                              >
                                <MenuItem value="Vendor 1">Vendor 1</MenuItem>
                                <MenuItem value="Vendor 2">Vendor 2</MenuItem>
                                <MenuItem value="Vendor 3">Vendor 3</MenuItem>
                              </TextField>
                            </Grid>
                          </Grid>
                          <div className="view-vendor">
                            <ArrowDropDownIcon />
                            View Vendor Details
                          </div>
                          <div className="flex-display">
                            <img src={invoiceImage} alt="vendor image" />
                            <Typography variant="h6" gutterBottom m={3}>
                              Invoice Details
                            </Typography>
                          </div>
                          <div style={{ margin: 10 }}>
                            <Typography variant="h6" gutterBottom>
                              General Information
                            </Typography>
                          </div>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                select
                                name="purchaseOrderNumber"
                                label="Purchase Order Number"
                                variant="outlined"
                                value={values.purchaseOrderNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.purchaseOrderNumber &&
                                  Boolean(errors.purchaseOrderNumber)
                                }
                                helperText={
                                  touched.purchaseOrderNumber &&
                                  errors.purchaseOrderNumber
                                }
                              >
                                <MenuItem value="P0-1738">P0-1738</MenuItem>
                                <MenuItem value="P0-2738">P0-2738</MenuItem>
                                <MenuItem value="P0-3738">P0-3738</MenuItem>
                              </TextField>
                            </Grid>
                          </Grid>
                          <div style={{ margin: 10 }}>
                            <Typography variant="h6" gutterBottom>
                              Invoice Details
                            </Typography>
                          </div>

                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                name="invoiceNumber"
                                select
                                label="Invoice Number"
                                value={values.invoiceNumber}
                                variant="outlined"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.invoiceNumber &&
                                  Boolean(errors.invoiceNumber)
                                }
                                helperText={
                                  touched.invoiceNumber && errors.invoiceNumber
                                }
                              >
                                <MenuItem value="IV-2323">IV-2923</MenuItem>
                                <MenuItem value="IV-323">IV-323</MenuItem>
                                <MenuItem value="IV-923">IV-923</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                type="date"
                                name="invoiceDate"
                                label="Invoice Date"
                                slotProps={{
                                  inputLabel: {
                                    shrink: true,
                                  },
                                }}
                                variant="outlined"
                                value={values.invoiceDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.invoiceDate &&
                                  Boolean(errors.invoiceDate)
                                }
                                helperText={
                                  touched.invoiceDate && errors.invoiceDate
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                name="totalAmount"
                                label="Total Amount"
                                type="number"
                                variant="outlined"
                                placeholder="0.00"
                                value={values.totalAmount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.totalAmount &&
                                  Boolean(errors.totalAmount)
                                }
                                helperText={
                                  touched.totalAmount && errors.totalAmount
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AttachMoneyIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                select
                                name="paymentTerms"
                                label="Payment Terms"
                                variant="outlined"
                                value={values.paymentTerms}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.paymentTerms &&
                                  Boolean(errors.paymentTerms)
                                }
                                helperText={
                                  touched.paymentTerms && errors.paymentTerms
                                }
                              >
                                <MenuItem value="net30">Net 30</MenuItem>
                                <MenuItem value="net60">Net 60</MenuItem>
                                <MenuItem value="net90">Net 90</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                type="date"
                                name="invoiceDueDate"
                                label="Invoice Due Date"
                                slotProps={{
                                  inputLabel: {
                                    shrink: true,
                                  },
                                }}
                                variant="outlined"
                                value={values.invoiceDueDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.invoiceDueDate &&
                                  Boolean(errors.invoiceDueDate)
                                }
                                helperText={
                                  touched.invoiceDueDate &&
                                  errors.invoiceDueDate
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                type="date"
                                name="glPostDate"
                                label="GL Post Date"
                                slotProps={{
                                  inputLabel: {
                                    shrink: true,
                                  },
                                }}
                                variant="outlined"
                                value={values.glPostDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.glPostDate &&
                                  Boolean(errors.glPostDate)
                                }
                                helperText={
                                  touched.glPostDate && errors.glPostDate
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                name="invoiceDescription"
                                label="Inovice Description"
                                variant="outlined"
                                value={values.invoiceDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.invoiceDescription &&
                                  Boolean(errors.invoiceDescription)
                                }
                                helperText={
                                  touched.invoiceDescription &&
                                  errors.invoiceDescription
                                }
                              />
                            </Grid>
                          </Grid>

                          <Typography
                            variant="h6"
                            gutterBottom
                            style={{ marginTop: "20px" }}
                          >
                            Expense Details
                          </Typography>
                          <FieldArray name="expenseDetails">
                            {({ push, remove }) => (
                              <>
                                {values?.expenseDetails?.map((_, index) => (
                                  <Box key={index} className="expense-item">
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={6}>
                                        <TextField
                                          fullWidth
                                          name={`expenseDetails.${index}.lineAmount`}
                                          label="Line Amount"
                                          type="number"
                                          variant="outlined"
                                          value={
                                            values.expenseDetails?.[index]
                                              ?.lineAmount
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.expenseDetails?.[index]
                                              ?.lineAmount &&
                                            Boolean(
                                              errors.expenseDetails?.[index]
                                                ?.lineAmount
                                            )
                                          }
                                          helperText={
                                            touched.expenseDetails?.[index]
                                              ?.lineAmount &&
                                            errors.expenseDetails?.[index]
                                              ?.lineAmount
                                          }
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <TextField
                                          fullWidth
                                          select
                                          name={`expenseDetails.${index}.department`}
                                          label="Department"
                                          variant="outlined"
                                          placeholder="Select Department"
                                          value={
                                            values.expenseDetails?.[index]
                                              ?.department
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.expenseDetails?.[index]
                                              ?.department &&
                                            Boolean(
                                              errors.expenseDetails?.[index]
                                                ?.department
                                            )
                                          }
                                          helperText={
                                            touched.expenseDetails?.[index]
                                              ?.department &&
                                            errors.expenseDetails?.[index]
                                              ?.department
                                          }
                                        >
                                          <MenuItem value="IT">IT</MenuItem>
                                          <MenuItem value="HR">HR</MenuItem>
                                          <MenuItem value="Finance">
                                            Finance
                                          </MenuItem>
                                        </TextField>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <TextField
                                          fullWidth
                                          select
                                          name={`expenseDetails.${index}.account`}
                                          label="Account"
                                          variant="outlined"
                                          placeholder="Select Account"
                                          value={
                                            values.expenseDetails?.[index]
                                              ?.account
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.expenseDetails?.[index]
                                              ?.account &&
                                            Boolean(
                                              errors.expenseDetails?.[index]
                                                ?.account
                                            )
                                          }
                                          helperText={
                                            touched.expenseDetails?.[index]
                                              ?.account &&
                                            errors.expenseDetails?.[index]
                                              ?.account
                                          }
                                        >
                                          <MenuItem value="SBI">SBI</MenuItem>
                                          <MenuItem value="ICICI">
                                            ICICI
                                          </MenuItem>
                                          <MenuItem value="HDFC">HDFC</MenuItem>
                                        </TextField>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <TextField
                                          fullWidth
                                          select
                                          name={`expenseDetails.${index}.location`}
                                          label="Location"
                                          variant="outlined"
                                          placeholder="Select Location"
                                          value={
                                            values.expenseDetails?.[index]
                                              ?.location
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.expenseDetails?.[index]
                                              ?.location &&
                                            Boolean(
                                              errors.expenseDetails?.[index]
                                                ?.location
                                            )
                                          }
                                          helperText={
                                            touched.expenseDetails?.[index]
                                              ?.location &&
                                            errors.expenseDetails?.[index]
                                              ?.location
                                          }
                                        >
                                          <MenuItem value="Bengaluru">
                                            Bengaluru
                                          </MenuItem>
                                          <MenuItem value="Hosur">
                                            Hosur
                                          </MenuItem>
                                          <MenuItem value="Mumbai">
                                            Mumbai
                                          </MenuItem>
                                        </TextField>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <TextField
                                          fullWidth
                                          name={`expenseDetails.${index}.description`}
                                          label="Description"
                                          variant="outlined"
                                          value={
                                            values.expenseDetails?.[index]
                                              ?.description
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.expenseDetails?.[index]
                                              ?.description &&
                                            Boolean(
                                              errors.expenseDetails?.[index]
                                                ?.description
                                            )
                                          }
                                          helperText={
                                            touched.expenseDetails?.[index]
                                              ?.description &&
                                            errors.expenseDetails?.[index]
                                              ?.description
                                          }
                                        />
                                      </Grid>
                                      {index > 0 && (
                                        <Grid item xs={12}>
                                          <IconButton
                                            color="error"
                                            onClick={() => remove(index)}
                                          >
                                            <Delete />
                                          </IconButton>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Box>
                                ))}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Button
                                    startIcon={<Add />}
                                    onClick={() =>
                                      push({
                                        lineAmount: "",
                                        department: "",
                                        account: "",
                                        location: "",
                                        description: "",
                                      })
                                    }
                                    variant="outlined"
                                    style={{ marginTop: "10px" }}
                                  >
                                    Add Expense
                                  </Button>
                                </div>
                              </>
                            )}
                          </FieldArray>
                        </>
                        <div className="flex-display">
                          <img src={commentsImage} alt="vendor image" />
                          <Typography variant="h6" gutterBottom m={3}>
                            Comments
                          </Typography>
                        </div>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="comments"
                              label="Comments"
                              variant="outlined"
                              value={values?.comments}
                              placeholder="Add a comment and use @Name to tag someone"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.comments && Boolean(errors.comments)
                              }
                              helperText={touched.comments && errors.comments}
                            />
                          </Grid>
                        </Grid>
                      </div>

                      <Box className="button-group">
                        <Button
                          variant="outlined"
                          onClick={() => handleSaveDraft(values)}
                        >
                          Save as Draft
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          onClick={() => handleSubmit(values)}
                        >
                          Submit & New
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </TabPanel>

              <TabPanel value={selectedTab} index={1}>
                <h2>Invoice Details Content</h2>
                <p>Here goes the content for the Invoice Details section.</p>
              </TabPanel>

              <TabPanel value={selectedTab} index={2}>
                <h2>Comments Content</h2>
                <p>Here goes the content for the Comments section.</p>
              </TabPanel>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
