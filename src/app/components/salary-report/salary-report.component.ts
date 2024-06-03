import { Component, OnInit } from '@angular/core';
import { SalaryReportService } from 'src/app/services/salary-report.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-salary-report',
  templateUrl: './salary-report.component.html',
  styleUrls: ['./salary-report.component.css']
})
export class SalaryReportComponent implements OnInit {
  months: string[] = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  years: number[] = [];
  Search: any;
  Month: any;
  Year: any;
  salaryReports: any;
  disablesSearch: boolean = true;
  tableLoading: boolean = false;
  englishMonth: any;
  constructor(public salaryReportsServices: SalaryReportService) {
    const currentYear = new Date().getFullYear();
    for (let year = 2008; year <= currentYear; year++) {
      this.years.push(year);
    }
  }
  ngOnInit(): void {
    this.tableLoading = true;
    this.salaryReportsServices.getSalaryReports().subscribe({
      next: data => {
        this.salaryReports = data;
        this.tableLoading = false;
      }, error: e => {
        this.tableLoading = false;
        alert(e.error);
      }
    })
  }
  enabledSearch() {
    if ((this.Search && this.Search != '') || (this.Month && this.Year)) this.disablesSearch = false;
    else this.disablesSearch = true;
  }

  search() {
    this.tableLoading = true;
    if (this.Search && this.Search != '') {
      if ((this.Month && this.Year)) this.salaryReportsServices.getSalaryReportByBoth(this.Year, this.Month, this.Search).subscribe({
        next: data => {
          this.salaryReports = data;
          this.tableLoading = false;

        }, error: e => {
          this.tableLoading = false;
          this.salaryReports = [];
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Data not found",
          });

        }
      })
      else this.salaryReportsServices.getSalaryReportByName(this.Search).subscribe({
        next: data => {
          this.salaryReports = data;
          this.tableLoading = false;
          if (this.salaryReports.length == 0) Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Employee Name not found",
          });

        }, error: e => {
          this.tableLoading = false;
          this.salaryReports = [];

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Data not found",
          });

        }

      })
    }
    else this.salaryReportsServices.getSalaryReportByDate(this.Year, this.Month).subscribe({
      next: data => {
        this.salaryReports = data;
        this.tableLoading = false;

      }, error: e => {
        this.tableLoading = false;
        this.salaryReports = [];
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Data not found",
        });

      }

    })
  }
  generatePDF(index: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You Will Download it",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Download it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const elementToPrint: any = document.getElementById("pdfContent");
        const arabicMonthNames: any = {
          "يناير": "January",
          "فبراير": "February",
          "مارس": "March",
          "أبريل": "April",
          "مايو": "May",
          "يونيو": "June",
          "يوليو": "July",
          "أغسطس": "August",
          "سبتمبر": "September",
          "أكتوبر": "October",
          "نوفمبر": "November",
          "ديسمبر": "December"
        };

        const monthName = this.salaryReports[index].nameMonth;
        // Get the English month name
        this.englishMonth = '';
        if (arabicMonthNames.hasOwnProperty(monthName)) {
          this.englishMonth = arabicMonthNames[monthName];

        } else {
          // If the month name is already in English, use it directly
          this.englishMonth = this.salaryReports[index].nameMonth
        };

        const year = this.salaryReports[index].nameYear;
        // Ensure proper formatting of the date
        const formattedDate = `${this.englishMonth}, ${year}`;
        html2canvas(elementToPrint, { scale: 2 }).then((canvas) => {
          const pdf = new jsPDF();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
          pdf.setFont("helvetica", "bold");
          pdf.text("Name:", 10, 10);
          pdf.setFont("helvetica", "normal");
          pdf.text(this.salaryReports[index].empName, 28, 10);
          pdf.setFont("helvetica", "bold");
          pdf.text("Department:", 10, 20);
          pdf.setFont("helvetica", "normal");
          pdf.text(this.salaryReports[index].deptName, 44, 20);
          pdf.setFont("helvetica", "bold");
          pdf.text("Date:", 10, 30);
          pdf.setFont("helvetica", "normal");
          pdf.text(formattedDate, 25, 30);
          pdf.text("-----------------------------------------------------------------------------------------------------", 10, 37);
          pdf.setFont("helvetica", "normal");
          pdf.text("Main Salary:", 20, 55);
          pdf.text(`${this.salaryReports[index].mainSalary} EGP`, 160, 55);
          pdf.text("Attend Days:", 20, 75);
          pdf.text(`${this.salaryReports[index].attendDay}`, 168, 75);
          pdf.text("Absent Days:", 20, 95);
          pdf.text(`${this.salaryReports[index].absentDay}`, 168, 95);
          pdf.text("OverTime Hours:", 20, 115);
          pdf.text(`${this.salaryReports[index].extraHours}`, 168, 115);
          pdf.text("Deductions Hours:", 20, 135);
          pdf.text(`${this.salaryReports[index].dedectionHours}`, 168, 135);
          pdf.text("Total OverTime:", 20, 155);
          pdf.text(`${this.salaryReports[index].totalExtra} EGP`, 160, 155);
          pdf.text("Total Deductions:", 20, 175);
          pdf.text(`${this.salaryReports[index].totalDiscount} EGP`, 160, 175);
          pdf.text("Net Salary:", 20, 195);
          pdf.text(`${this.salaryReports[index].totalNetSalary} EGP`, 160, 195);
          pdf.text("-----------------------------------------------------------------------------------------------------", 10, 283);
          pdf.setFont("helvetica", "bold");
          pdf.text("sales@pioneers-solutions.com", 118, 287);
          pdf.save(`${this.salaryReports[index].empName} Salary Report (${formattedDate}).pdf`);
        });
        Swal.fire({
          title: "Downloaded!",
          text: "Your PDF has been Downloaded.",
          icon: "success"
        });
      }
    });

  }
}