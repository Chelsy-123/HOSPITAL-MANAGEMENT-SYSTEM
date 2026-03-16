from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from admin_app.models import Staff

from .models import Consultation, Prescription, MedicinePrescription, TestPrescription
from .serializers import (
    ConsultationSerializer,
    PrescriptionSerializer,
    PrescriptionCreateSerializer,
    MedicinePrescriptionSerializer,
    TestPrescriptionSerializer
)


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.select_related(
        'appointment__Patient',  # Match exact field name
        'doctor__user'
    ).all()
    serializer_class = ConsultationSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'Doctor':
            queryset = queryset.filter(doctor__user=user)
        return queryset

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        consultations = self.get_queryset().filter(consultationdate=today).order_by('-consultationtime')
        serializer = self.get_serializer(consultations, many=True)
        return Response({'date': today, 'count': consultations.count(), 'consultations': serializer.data})

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        today = timezone.now().date()
        consultations = self.get_queryset().filter(
            consultationdate__gte=today,
            status__in=['SCHEDULED', 'INPROGRESS']
        ).order_by('consultationdate', 'consultationtime')
        serializer = self.get_serializer(consultations, many=True)
        return Response({'count': consultations.count(), 'consultations': serializer.data})

    @action(detail=True, methods=['get', 'post'])
    def prescription(self, request, pk=None):
        consultation = self.get_object()
        prescription = getattr(consultation, 'prescriptions', None)
        if request.method == 'GET':
            if prescription:
                serializer = PrescriptionSerializer(prescription)
                return Response(serializer.data)
            return Response({'message': 'No prescription found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            if prescription:
                serializer = PrescriptionCreateSerializer(prescription, data=request.data)
            else:
                serializer = PrescriptionCreateSerializer(data={**request.data, 'consultation': consultation.consultationid})
            serializer.is_valid(raise_exception=True)
            serializer.save(consultation=consultation)
            return Response(serializer.data)
        
    def perform_create(self, serializer):
        # Get the Staff object for the logged-in user
        staff_obj = Staff.objects.get(user=self.request.user)
        serializer.save(doctor=staff_obj)

# ✅ UPDATED VERSION
class PrescriptionViewSet(viewsets.ModelViewSet):
    """Prescription Management ViewSet with proper doctor assignment"""
    queryset = Prescription.objects.select_related(
        'consultation__appointment__Patient',
        'doctor__user'
    ).all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PrescriptionCreateSerializer
        return PrescriptionSerializer
    
    def get_queryset(self):
        """Filter prescriptions by consultation if query param provided"""
        queryset = super().get_queryset()
        consultation_id = self.request.query_params.get('consultation', None)
        if consultation_id:
            queryset = queryset.filter(consultation_id=consultation_id)
        return queryset
    
    def perform_create(self, serializer):
        """Auto-assign the logged-in doctor when creating prescription"""
        staff_obj = Staff.objects.get(user=self.request.user)
        serializer.save(doctor=staff_obj)

class MedicinePrescriptionViewSet(viewsets.ModelViewSet):
    queryset = MedicinePrescription.objects.select_related('prescription')
    serializer_class = MedicinePrescriptionSerializer

class TestPrescriptionViewSet(viewsets.ModelViewSet):
    queryset = TestPrescription.objects.select_related('prescription')
    serializer_class = TestPrescriptionSerializer


from rest_framework.permissions import IsAuthenticated
from receptionist_app.models import Appointment
from .serializers import DoctorAppointmentSerializer
from .permissions import IsDoctor   # Assuming you have this permission

import datetime


class DoctorAppointmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Doctors can view only today's appointments assigned to them.
    """
    serializer_class = DoctorAppointmentSerializer
    permission_classes = [IsAuthenticated, IsDoctor]

    def get_queryset(self):
        import datetime
        user = self.request.user
        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                target_date = datetime.date.today()
        else:
            target_date = datetime.date.today()
        if hasattr(user, "doctor"):
            return Appointment.objects.filter(
                doctor=user.doctor,
                Appointment_date=target_date,
            ).order_by("Appointment_date", "Appointment_time")
        return Appointment.objects.none()
    

from rest_framework.decorators import api_view, permission_classes

from admin_app.models import Doctor

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctor_profile(request):
    """
    Fetch doctor profile with specialization.
    """
    user = request.user
    try:
        doctor = Doctor.objects.select_related('specialization').get(user=user)
        return Response({
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'specialization': doctor.specialization.name if doctor.specialization else 'N/A',
            'experience': doctor.experience,
            'consultation_fee': str(doctor.consultation_fee),
            'role': user.role
        })
    except Doctor.DoesNotExist:
        return Response({
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'specialization': 'N/A',
            'role': user.role
        }, status=200)
    
    
# doctor_app/views.py

from rest_framework import viewsets, permissions
from pharmacist_app.models import Medicine
from .serializers import MedicineSimpleSerializer

class MedicineSearchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MedicineSimpleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Medicine.objects.all()
        search_term = self.request.query_params.get('search', '')
        if search_term:
            queryset = queryset.filter(name__istartswith=search_term)
        return queryset.order_by('name')

